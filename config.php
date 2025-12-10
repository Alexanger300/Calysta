<?php
// config.php
define('DB_HOST', 'localhost');        // Serveur PostgreSQL
define('DB_PORT', 5432);               // Port par défaut PostgreSQL
define('DB_USER', 'postgres');         // Utilisateur PostgreSQL
define('DB_PASS', '31122007Alex');     // Mot de passe PostgreSQL
define('DB_NAME', 'Inscription');     // Nom de la base de données

try {
    // Connexion directe à la database utilisateurs
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
    $conn = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    // Afficher l'erreur exacte pour le débogage
    error_log("Erreur PDO : " . $e->getMessage());
    die("Erreur de connexion : " . $e->getMessage() . " (Code: " . $e->getCode() . ")");
}
?>
