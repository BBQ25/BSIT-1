<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';

use TCPDF;
use Dompdf\Dompdf;
use Dompdf\Options;

class PDFGenerator {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Generate PDF from text content
     */
    public function generateFromText($data) {
        $title = $data['title'] ?? 'Document';
        $content = $data['content'] ?? '';
        $fontSize = $data['fontSize'] ?? 12;
        $fontFamily = $data['fontFamily'] ?? 'helvetica';
        $pageSize = $data['pageSize'] ?? 'A4';
        $textColor = $data['textColor'] ?? '#000000';
        
        // Create new PDF document
        $pdf = new TCPDF($pageSize == 'A4' ? 'P' : 'L', 'mm', $pageSize, true, 'UTF-8', false);
        
        // Set document information
        $pdf->SetCreator('PDF Generator');
        $pdf->SetAuthor('PDF Generator System');
        $pdf->SetTitle($title);
        
        // Remove default header/footer
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        
        // Set margins
        $pdf->SetMargins(15, 15, 15);
        $pdf->SetAutoPageBreak(TRUE, 15);
        
        // Add a page
        $pdf->AddPage();
        
        // Set font
        $pdf->SetFont($fontFamily, '', $fontSize);
        
        // Convert hex color to RGB
        list($r, $g, $b) = sscanf($textColor, "#%02x%02x%02x");
        $pdf->SetTextColor($r, $g, $b);
        
        // Add title
        $pdf->SetFont($fontFamily, 'B', $fontSize + 8);
        $pdf->Cell(0, 10, $title, 0, 1, 'C');
        $pdf->Ln(5);
        
        // Add content
        $pdf->SetFont($fontFamily, '', $fontSize);
        $pdf->MultiCell(0, 5, $content, 0, 'J');
        
        // Generate filename
        $filename = 'text_' . time() . '_' . rand(1000, 9999) . '.pdf';
        $filepath = DOWNLOAD_DIR . $filename;
        
        // Output PDF
        $pdf->Output($filepath, 'F');
        
        // Log to database
        $this->logPDFGeneration('text', $filename, $filepath, filesize($filepath), $data);
        
        return [
            'success' => true,
            'filename' => $filename,
            'path' => $filepath,
            'url' => '/downloads/' . $filename
        ];
    }
    
    /**
     * Generate PDF from HTML content
     */
    public function generateFromHTML($data) {
        $html = $data['html'] ?? '';
        $pageSize = $data['pageSize'] ?? 'A4';
        $orientation = $data['orientation'] ?? 'portrait';
        
        // Configure Dompdf
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('isRemoteEnabled', true);
        
        $dompdf = new Dompdf($options);
        
        // Load HTML
        $dompdf->loadHtml($html);
        
        // Set paper size and orientation
        $dompdf->setPaper($pageSize, $orientation);
        
        // Render PDF
        $dompdf->render();
        
        // Generate filename
        $filename = 'html_' . time() . '_' . rand(1000, 9999) . '.pdf';
        $filepath = DOWNLOAD_DIR . $filename;
        
        // Save PDF
        file_put_contents($filepath, $dompdf->output());
        
        // Log to database
        $this->logPDFGeneration('html', $filename, $filepath, filesize($filepath), $data);
        
        return [
            'success' => true,
            'filename' => $filename,
            'path' => $filepath,
            'url' => '/downloads/' . $filename
        ];
    }
    
    /**
     * Generate PDF from images
     */
    public function generateFromImages($files) {
        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
        
        $pdf->SetCreator('PDF Generator');
        $pdf->SetTitle('Images PDF');
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(0, 0, 0);
        $pdf->SetAutoPageBreak(false, 0);
        
        foreach ($files as $file) {
            if (in_array($file['type'], ALLOWED_IMAGE_TYPES)) {
                $pdf->AddPage();
                
                // Get image dimensions
                list($width, $height) = getimagesize($file['tmp_name']);
                
                // Calculate scaling to fit page
                $pageWidth = $pdf->getPageWidth();
                $pageHeight = $pdf->getPageHeight();
                
                $scale = min($pageWidth / $width, $pageHeight / $height);
                $newWidth = $width * $scale;
                $newHeight = $height * $scale;
                
                // Center image on page
                $x = ($pageWidth - $newWidth) / 2;
                $y = ($pageHeight - $newHeight) / 2;
                
                // Add image to PDF
                $pdf->Image($file['tmp_name'], $x, $y, $newWidth, $newHeight);
            }
        }
        
        // Generate filename
        $filename = 'images_' . time() . '_' . rand(1000, 9999) . '.pdf';
        $filepath = DOWNLOAD_DIR . $filename;
        
        // Output PDF
        $pdf->Output($filepath, 'F');
        
        // Log to database
        $this->logPDFGeneration('images', $filename, $filepath, filesize($filepath), ['count' => count($files)]);
        
        return [
            'success' => true,
            'filename' => $filename,
            'path' => $filepath,
            'url' => '/downloads/' . $filename
        ];
    }
    
    /**
     * Generate PDF from form data
     */
    public function generateFromForm($data) {
        $formData = $data['formData'] ?? [];
        $template = $data['template'] ?? 'Default Form';
        
        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
        
        $pdf->SetCreator('PDF Generator');
        $pdf->SetTitle($template);
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(15, 15, 15);
        $pdf->SetAutoPageBreak(TRUE, 15);
        
        $pdf->AddPage();
        
        // Add form title
        $pdf->SetFont('helvetica', 'B', 20);
        $pdf->Cell(0, 10, $template, 0, 1, 'C');
        $pdf->Ln(10);
        
        // Add form fields
        $pdf->SetFont('helvetica', '', 11);
        foreach ($formData as $key => $value) {
            $pdf->SetFont('helvetica', 'B', 11);
            $pdf->Cell(50, 8, $key . ':', 0, 0, 'L');
            $pdf->SetFont('helvetica', '', 11);
            $pdf->Cell(0, 8, $value, 0, 1, 'L');
            $pdf->Ln(2);
        }
        
        // Add timestamp
        $pdf->Ln(10);
        $pdf->SetFont('helvetica', 'I', 9);
        $pdf->SetTextColor(128, 128, 128);
        $pdf->Cell(0, 10, 'Generated on: ' . date('Y-m-d H:i:s'), 0, 1, 'R');
        
        // Generate filename
        $filename = 'form_' . time() . '_' . rand(1000, 9999) . '.pdf';
        $filepath = DOWNLOAD_DIR . $filename;
        
        // Output PDF
        $pdf->Output($filepath, 'F');
        
        // Log to database
        $this->logPDFGeneration('form', $filename, $filepath, filesize($filepath), $data);
        
        return [
            'success' => true,
            'filename' => $filename,
            'path' => $filepath,
            'url' => '/downloads/' . $filename
        ];
    }
    
    /**
     * Generate invoice PDF
     */
    public function generateInvoice($data) {
        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
        
        $pdf->SetCreator('PDF Generator');
        $pdf->SetTitle('Invoice #' . $data['invoiceNumber']);
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(15, 15, 15);
        $pdf->SetAutoPageBreak(TRUE, 15);
        
        $pdf->AddPage();
        
        // Invoice header
        $pdf->SetFont('helvetica', 'B', 24);
        $pdf->Cell(0, 10, 'INVOICE', 0, 1, 'C');
        $pdf->Ln(5);
        
        // Invoice details
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 5, 'Invoice #: ' . $data['invoiceNumber'], 0, 1, 'R');
        $pdf->Cell(0, 5, 'Date: ' . $data['date'], 0, 1, 'R');
        $pdf->Cell(0, 5, 'Due Date: ' . $data['dueDate'], 0, 1, 'R');
        $pdf->Ln(10);
        
        // From and To sections
        $pdf->SetFont('helvetica', 'B', 12);
        $pdf->Cell(95, 5, 'FROM:', 0, 0, 'L');
        $pdf->Cell(95, 5, 'TO:', 0, 1, 'L');
        
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(95, 5, $data['from']['name'], 0, 0, 'L');
        $pdf->Cell(95, 5, $data['to']['name'], 0, 1, 'L');
        
        $pdf->Cell(95, 5, $data['from']['address'], 0, 0, 'L');
        $pdf->Cell(95, 5, $data['to']['address'], 0, 1, 'L');
        
        $pdf->Cell(95, 5, $data['from']['email'], 0, 0, 'L');
        $pdf->Cell(95, 5, $data['to']['email'], 0, 1, 'L');
        $pdf->Ln(10);
        
        // Items table header
        $pdf->SetFillColor(240, 240, 240);
        $pdf->SetFont('helvetica', 'B', 11);
        $pdf->Cell(80, 8, 'Description', 1, 0, 'L', true);
        $pdf->Cell(30, 8, 'Quantity', 1, 0, 'C', true);
        $pdf->Cell(35, 8, 'Price', 1, 0, 'R', true);
        $pdf->Cell(35, 8, 'Total', 1, 1, 'R', true);
        
        // Items
        $pdf->SetFont('helvetica', '', 10);
        $subtotal = 0;
        foreach ($data['items'] as $item) {
            $total = $item['quantity'] * $item['price'];
            $subtotal += $total;
            
            $pdf->Cell(80, 7, $item['description'], 1, 0, 'L');
            $pdf->Cell(30, 7, $item['quantity'], 1, 0, 'C');
            $pdf->Cell(35, 7, '$' . number_format($item['price'], 2), 1, 0, 'R');
            $pdf->Cell(35, 7, '$' . number_format($total, 2), 1, 1, 'R');
        }
        
        // Totals
        $pdf->Ln(5);
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(145, 6, 'Subtotal:', 0, 0, 'R');
        $pdf->Cell(35, 6, '$' . number_format($subtotal, 2), 0, 1, 'R');
        
        if ($data['discount'] > 0) {
            $discountAmount = $subtotal * ($data['discount'] / 100);
            $pdf->Cell(145, 6, 'Discount (' . $data['discount'] . '%):', 0, 0, 'R');
            $pdf->Cell(35, 6, '-$' . number_format($discountAmount, 2), 0, 1, 'R');
            $subtotal -= $discountAmount;
        }
        
        if ($data['tax'] > 0) {
            $taxAmount = $subtotal * ($data['tax'] / 100);
            $pdf->Cell(145, 6, 'Tax (' . $data['tax'] . '%):', 0, 0, 'R');
            $pdf->Cell(35, 6, '$' . number_format($taxAmount, 2), 0, 1, 'R');
            $subtotal += $taxAmount;
        }
        
        $pdf->SetFont('helvetica', 'B', 12);
        $pdf->Cell(145, 8, 'Total:', 0, 0, 'R');
        $pdf->Cell(35, 8, '$' . number_format($subtotal, 2), 0, 1, 'R');
        
        // Notes
        if (!empty($data['notes'])) {
            $pdf->Ln(10);
            $pdf->SetFont('helvetica', 'B', 11);
            $pdf->Cell(0, 5, 'Notes:', 0, 1, 'L');
            $pdf->SetFont('helvetica', '', 10);
            $pdf->MultiCell(0, 5, $data['notes'], 0, 'L');
        }
        
        // Generate filename
        $filename = 'invoice_' . $data['invoiceNumber'] . '_' . time() . '.pdf';
        $filepath = DOWNLOAD_DIR . $filename;
        
        // Output PDF
        $pdf->Output($filepath, 'F');
        
        // Log to database
        $this->logPDFGeneration('invoice', $filename, $filepath, filesize($filepath), $data);
        
        return [
            'success' => true,
            'filename' => $filename,
            'path' => $filepath,
            'url' => '/downloads/' . $filename
        ];
    }
    
    /**
     * Merge multiple PDF files
     */
    public function mergePDFs($files) {
        require_once __DIR__ . '/../vendor/setasign/fpdi/src/autoload.php';
        
        $pdf = new \setasign\Fpdi\Tcpdf\Fpdi();
        
        foreach ($files as $file) {
            if ($file['type'] == ALLOWED_PDF_TYPE) {
                $pageCount = $pdf->setSourceFile($file['tmp_name']);
                
                for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                    $templateId = $pdf->importPage($pageNo);
                    $size = $pdf->getTemplateSize($templateId);
                    
                    $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                    $pdf->useTemplate($templateId);
                }
            }
        }
        
        // Generate filename
        $filename = 'merged_' . time() . '_' . rand(1000, 9999) . '.pdf';
        $filepath = DOWNLOAD_DIR . $filename;
        
        // Output PDF
        $pdf->Output($filepath, 'F');
        
        // Log to database
        $this->logPDFGeneration('merge', $filename, $filepath, filesize($filepath), ['count' => count($files)]);
        
        return [
            'success' => true,
            'filename' => $filename,
            'path' => $filepath,
            'url' => '/downloads/' . $filename
        ];
    }
    
    /**
     * Log PDF generation to database
     */
    private function logPDFGeneration($type, $filename, $filepath, $filesize, $metadata) {
        $conn = $this->db->getConnection();
        
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $metadataJson = json_encode($metadata);
        
        $stmt = $conn->prepare("INSERT INTO pdf_history (type, filename, file_path, file_size, ip_address, user_agent, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssisss", $type, $filename, $filepath, $filesize, $ip, $userAgent, $metadataJson);
        $stmt->execute();
        $stmt->close();
    }
    
    /**
     * Get PDF generation history
     */
    public function getHistory($limit = 50) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM pdf_history ORDER BY created_at DESC LIMIT ?");
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $history = [];
        
        while ($row = $result->fetch_assoc()) {
            $history[] = $row;
        }
        
        $stmt->close();
        return $history;
    }
    
    /**
     * Clean old files
     */
    public function cleanOldFiles($hours = 24) {
        $expireTime = time() - ($hours * 3600);
        
        // Clean download directory
        $files = glob(DOWNLOAD_DIR . '*');
        foreach ($files as $file) {
            if (is_file($file) && filemtime($file) < $expireTime) {
                unlink($file);
            }
        }
        
        // Clean upload directory
        $files = glob(UPLOAD_DIR . '*');
        foreach ($files as $file) {
            if (is_file($file) && filemtime($file) < $expireTime) {
                unlink($file);
            }
        }
    }
}