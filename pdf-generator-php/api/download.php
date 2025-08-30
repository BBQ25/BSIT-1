<?php
require_once __DIR__ . '/../config/database.php';

// Get filename from request
$filename = $_GET['file'] ?? '';

if (empty($filename)) {
    http_response_code(400);
    die('File parameter is required');
}

// Sanitize filename
$filename = basename($filename);
$filepath = DOWNLOAD_DIR . $filename;

// Check if file exists
if (!file_exists($filepath)) {
    http_response_code(404);
    die('File not found');
}

// Check if file is a PDF
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $filepath);
finfo_close($finfo);

if ($mimeType !== 'application/pdf') {
    http_response_code(403);
    die('Invalid file type');
}

// Set headers for download
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . filesize($filepath));
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Output file
readfile($filepath);