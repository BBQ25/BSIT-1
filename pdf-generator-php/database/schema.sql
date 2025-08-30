-- PDF Generator Database Schema

CREATE DATABASE IF NOT EXISTS pdf_generator;
USE pdf_generator;

-- Table for storing PDF generation history
CREATE TABLE IF NOT EXISTS pdf_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for storing templates
CREATE TABLE IF NOT EXISTS templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT,
    settings JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name_type (name, type),
    INDEX idx_type (type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for storing form templates
CREATE TABLE IF NOT EXISTS form_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    fields JSON NOT NULL,
    layout JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for invoice templates
CREATE TABLE IF NOT EXISTS invoice_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    company_info JSON,
    template_html TEXT,
    styles TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default templates
INSERT INTO templates (name, type, content, settings) VALUES
('Default Text Template', 'text', 'Default text PDF template', '{"font": "helvetica", "fontSize": 12}'),
('Professional Invoice', 'invoice', 'Professional invoice template', '{"color": "#333", "logo": true}'),
('Simple Form', 'form', 'Simple form template', '{"columns": 1, "border": true}');

INSERT INTO form_templates (name, fields) VALUES
('Contact Form', '[{"name": "full_name", "label": "Full Name", "type": "text", "required": true}, {"name": "email", "label": "Email", "type": "email", "required": true}, {"name": "message", "label": "Message", "type": "textarea", "required": false}]'),
('Application Form', '[{"name": "name", "label": "Name", "type": "text"}, {"name": "dob", "label": "Date of Birth", "type": "date"}, {"name": "address", "label": "Address", "type": "textarea"}]');