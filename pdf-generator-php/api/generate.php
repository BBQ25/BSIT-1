<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../includes/PDFGenerator.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get request type
$type = $_GET['type'] ?? '';

if (empty($type)) {
    http_response_code(400);
    echo json_encode(['error' => 'Type parameter is required']);
    exit();
}

$generator = new PDFGenerator();
$response = ['success' => false, 'message' => 'Unknown error'];

try {
    switch ($type) {
        case 'text':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['content'])) {
                throw new Exception('Content is required');
            }
            $response = $generator->generateFromText($data);
            break;
            
        case 'html':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['html'])) {
                throw new Exception('HTML content is required');
            }
            $response = $generator->generateFromHTML($data);
            break;
            
        case 'images':
            if (empty($_FILES['images'])) {
                throw new Exception('No images uploaded');
            }
            
            $files = [];
            if (is_array($_FILES['images']['name'])) {
                for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
                    $files[] = [
                        'name' => $_FILES['images']['name'][$i],
                        'type' => $_FILES['images']['type'][$i],
                        'tmp_name' => $_FILES['images']['tmp_name'][$i],
                        'error' => $_FILES['images']['error'][$i],
                        'size' => $_FILES['images']['size'][$i]
                    ];
                }
            } else {
                $files[] = $_FILES['images'];
            }
            
            $response = $generator->generateFromImages($files);
            break;
            
        case 'form':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['formData'])) {
                throw new Exception('Form data is required');
            }
            $response = $generator->generateFromForm($data);
            break;
            
        case 'invoice':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['invoiceNumber']) || empty($data['items'])) {
                throw new Exception('Invoice number and items are required');
            }
            $response = $generator->generateInvoice($data);
            break;
            
        case 'merge':
            if (empty($_FILES['pdfs'])) {
                throw new Exception('No PDF files uploaded');
            }
            
            $files = [];
            if (is_array($_FILES['pdfs']['name'])) {
                for ($i = 0; $i < count($_FILES['pdfs']['name']); $i++) {
                    $files[] = [
                        'name' => $_FILES['pdfs']['name'][$i],
                        'type' => $_FILES['pdfs']['type'][$i],
                        'tmp_name' => $_FILES['pdfs']['tmp_name'][$i],
                        'error' => $_FILES['pdfs']['error'][$i],
                        'size' => $_FILES['pdfs']['size'][$i]
                    ];
                }
            } else {
                $files[] = $_FILES['pdfs'];
            }
            
            if (count($files) < 2) {
                throw new Exception('At least 2 PDF files are required for merging');
            }
            
            $response = $generator->mergePDFs($files);
            break;
            
        default:
            throw new Exception('Invalid type parameter');
    }
    
    // Clean old files (older than 24 hours)
    $generator->cleanOldFiles(24);
    
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
    http_response_code(400);
}

echo json_encode($response);