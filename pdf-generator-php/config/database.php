<?php
// Database configuration

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pdf_generator');
define('DB_CHARSET', 'utf8mb4');

// Application configuration
define('UPLOAD_DIR', __DIR__ . '/../public/uploads/');
define('DOWNLOAD_DIR', __DIR__ . '/../public/downloads/');
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']);
define('ALLOWED_PDF_TYPE', 'application/pdf');

// Ensure directories exist
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}
if (!file_exists(DOWNLOAD_DIR)) {
    mkdir(DOWNLOAD_DIR, 0777, true);
}

/**
 * Database connection class using MySQLi
 */
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $this->connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }
        
        $this->connection->set_charset(DB_CHARSET);
    }
    
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function escape($string) {
        return $this->connection->real_escape_string($string);
    }
    
    public function query($sql) {
        return $this->connection->query($sql);
    }
    
    public function prepare($sql) {
        return $this->connection->prepare($sql);
    }
    
    public function getLastId() {
        return $this->connection->insert_id;
    }
    
    public function getError() {
        return $this->connection->error;
    }
    
    public function close() {
        $this->connection->close();
    }
}