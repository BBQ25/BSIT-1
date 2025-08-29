<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

// Basic bootstrap: load config and initialize container-like registry
$config = require __DIR__ . '/../app/config/config.php';

// Simple PSR-4 like autoload for app namespace if needed
spl_autoload_register(function ($class) {
	$prefix = 'App\\';
	$baseDir = __DIR__ . '/../app/';
	$len = strlen($prefix);
	if (strncmp($prefix, $class, $len) !== 0) {
		return;
	}
	$relative = str_replace('\\', '/', substr($class, $len));
	$file = $baseDir . $relative . '.php';
	if (file_exists($file)) {
		require $file;
	}
});

// DB connection
$mysqli = new mysqli(
	$config['db']['host'],
	$config['db']['user'],
	$config['db']['pass'],
	$config['db']['name'],
	$config['db']['port']
);
if ($mysqli->connect_errno) {
	http_response_code(500);
	echo 'DB connection failed';
	exit;
}
$mysqli->set_charset('utf8mb4');

// Simple router
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

use App\Controllers\TemplateController;

$controller = new TemplateController($mysqli, $config);

switch (true) {
	case $path === '/' || $path === '/templates':
		$controller->index();
		break;
	case $path === '/templates/create' && $_SERVER['REQUEST_METHOD'] === 'POST':
		$controller->create();
		break;
	case $path === '/templates/preview' && $_SERVER['REQUEST_METHOD'] === 'POST':
		$controller->preview();
		break;
	case $path === '/templates/export' && $_SERVER['REQUEST_METHOD'] === 'POST':
		$controller->export();
		break;
	default:
		http_response_code(404);
		echo 'Not Found';
		break;
}

