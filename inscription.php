<?php
/**
 * Traitement du formulaire d'inscription
 * Valide les données, les nettoie et les insère dans PostgreSQL
 * Adapté aux champs de index.html
 */

// Inclure la configuration de la base de données
require_once 'config.php';

// Initialiser un tableau de réponse
$response = [
    'success' => false,
    'message' => '',
    'errors' => []  
];

// Vérifier que la requête est en POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Récupérer et nettoyer les données du formulaire (correspondant à index.html)
    $nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
    $prenom = isset($_POST['prenom']) ? trim($_POST['prenom']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $campus = isset($_POST['Campus']) ? trim($_POST['Campus']) : '';
    
    // Validation des champs obligatoires
    // Email est obligatoire
    if (empty($email)) {
        $response['errors'][] = 'L\'email est obligatoire.';
    }
    
    // Campus/Ville est obligatoire
    if (empty($campus)) {
        $response['errors'][] = 'La ville/campus est obligatoire.';
    }
    
    // Validation du format email
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors'][] = 'L\'adresse email n\'est pas valide.';
    }
    
    // Si pas d'erreurs, insérer dans la base de données
    if (empty($response['errors'])) {
        try {
            // Préparer la requête SQL pour PostgreSQL
            // Les champs nom et prenom peuvent être NULL (optionnels)
            $sql = "INSERT INTO utilisateurs (nom, prenom, email, campus) 
                    VALUES (:nom, :prenom, :email, :campus)";
            
            $stmt = $conn->prepare($sql);
            
            // Lier les paramètres avec gestion correcte des NULL
            $nomValue = !empty($nom) ? $nom : null;
            $prenomValue = !empty($prenom) ? $prenom : null;
            
            $stmt->bindParam(':nom', $nomValue, $nomValue === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
            $stmt->bindParam(':prenom', $prenomValue, $prenomValue === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':campus', $campus, PDO::PARAM_STR);
            
            // Exécuter la requête
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Inscription réussie ! Merci de vous être inscrit. Nous vous contacterons bientôt.';
            } else {
                $response['message'] = 'Erreur lors de l\'insertion des données.';
            }
            
        } catch (PDOException $e) {
            // Vérifier si c'est une erreur de contrainte UNIQUE sur email
            if (strpos($e->getMessage(), 'unique') !== false || strpos($e->getMessage(), 'UNIQUE') !== false) {
                $response['message'] = 'Cette adresse email est déjà inscrite.';
            } else {
                $response['message'] = 'Erreur base de données : ' . $e->getMessage();
            }
        }
    } else {
        // Retourner les erreurs de validation
        $response['message'] = 'Veuillez corriger les erreurs ci-dessous :';
    }
    
} else {
    // Si ce n'est pas une requête POST, retourner une erreur
    $response['message'] = 'Méthode de requête non autorisée.';
}

// Retourner la réponse en JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
