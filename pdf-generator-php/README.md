# PDF Generator - PHP Edition

A professional PDF creation and generation web application built with PHP, MySQLi, JavaScript, and Tailwind CSS.

## 🚀 Features

- **Text to PDF**: Convert plain text into professionally formatted PDF documents
- **HTML to PDF**: Transform HTML content with CSS styling into PDFs
- **Images to PDF**: Combine multiple images into a single PDF document
- **Form to PDF**: Generate PDFs from form data with custom templates
- **Invoice Generator**: Create professional invoices with automatic calculations
- **PDF Merger**: Combine multiple PDF files into one document

## 🛠️ Tech Stack

### Backend
- **PHP 7.4+** - Server-side scripting
- **MySQLi** - Database connectivity
- **TCPDF** - PDF generation library
- **DomPDF** - HTML to PDF conversion
- **FPDI** - PDF merging functionality
- **Intervention/Image** - Image processing

### Frontend
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (Vanilla)** - Client-side interactivity
- **Font Awesome** - Icons
- **Responsive Design** - Mobile-friendly interface

## 📋 Requirements

- PHP 7.4 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Composer (for dependency management)
- Web server (Apache/Nginx) or PHP built-in server

## 🔧 Installation

### Quick Setup

1. Clone or download the project:
```bash
cd /workspace/pdf-generator-php
```

2. Run the setup script:
```bash
./setup.sh
```

This will:
- Install Composer dependencies
- Create the database
- Set up directories
- Configure permissions

### Manual Setup

1. Install dependencies:
```bash
composer install
```

2. Import database schema:
```bash
mysql -u root -p < database/schema.sql
```

3. Update database configuration in `config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'pdf_generator');
```

4. Create required directories:
```bash
mkdir -p public/uploads public/downloads
chmod 755 public/uploads public/downloads
```

## 🚀 Running the Application

### Option 1: PHP Built-in Server (Development)

```bash
php -S localhost:8000 -t public/
```

Access the application at: http://localhost:8000

### Option 2: Apache Configuration

1. Point document root to `/workspace/pdf-generator-php/public`
2. Ensure mod_rewrite is enabled
3. The `.htaccess` file will handle routing

### Option 3: Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /workspace/pdf-generator-php/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\. {
        deny all;
    }
}
```

## 📁 Project Structure

```
pdf-generator-php/
├── api/                 # API endpoints
│   ├── generate.php    # PDF generation endpoint
│   └── download.php    # File download endpoint
├── config/             # Configuration files
│   └── database.php    # Database configuration
├── database/           # Database files
│   └── schema.sql      # Database schema
├── includes/           # PHP classes
│   └── PDFGenerator.php # Main PDF generation class
├── public/             # Public web root
│   ├── index.php       # Main application file
│   ├── js/            # JavaScript files
│   │   └── app.js     # Application JavaScript
│   ├── uploads/       # Temporary upload directory
│   └── downloads/     # Generated PDFs directory
├── vendor/            # Composer dependencies
├── composer.json      # Composer configuration
├── setup.sh          # Setup script
└── README.md         # This file
```

## 🎨 Features Overview

### Text to PDF
- Customizable fonts and sizes
- Multiple page formats (A4, A3, Letter, Legal)
- Color selection for text
- Professional formatting

### HTML to PDF
- Full HTML and CSS support
- Sample templates provided
- Live preview before conversion
- Multiple page orientations

### Images to PDF
- Drag and drop interface
- Support for multiple image formats
- Automatic page sizing
- Batch processing

### Form to PDF
- Dynamic field creation
- Multiple templates
- Sample data for testing
- Professional layouts

### Invoice Generator
- Automatic calculations
- Tax and discount support
- Multiple line items
- Professional formatting
- Customizable templates

### PDF Merger
- Drag and drop PDFs
- Reorder before merging
- Visual file management
- Batch processing

## 🔒 Security Features

- Input validation and sanitization
- File type verification
- Automatic file cleanup (24 hours)
- SQL injection prevention
- XSS protection
- CSRF protection ready

## 🗄️ Database Schema

The application uses MySQL/MariaDB with the following main tables:

- `pdf_history` - Tracks all PDF generations
- `templates` - Stores reusable templates
- `form_templates` - Custom form templates
- `invoice_templates` - Invoice templates

## 📝 API Endpoints

### Generate PDF
```
POST /api/generate.php?type={type}
```

Types:
- `text` - Generate from text
- `html` - Generate from HTML
- `images` - Generate from images
- `form` - Generate from form data
- `invoice` - Generate invoice
- `merge` - Merge PDFs

### Download PDF
```
GET /api/download.php?file={filename}
```

## 🎯 Usage Examples

### Text to PDF
```javascript
const data = {
    title: "My Document",
    content: "This is the content...",
    fontSize: 12,
    fontFamily: "helvetica",
    pageSize: "A4",
    textColor: "#000000"
};

fetch('/api/generate.php?type=text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

### Invoice Generation
```javascript
const invoice = {
    invoiceNumber: "INV-001",
    date: "2024-01-01",
    dueDate: "2024-01-31",
    from: { name: "Company", address: "...", email: "..." },
    to: { name: "Client", address: "...", email: "..." },
    items: [
        { description: "Service", quantity: 1, price: 100 }
    ],
    tax: 10,
    discount: 5,
    notes: "Thank you!"
};

fetch('/api/generate.php?type=invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice)
});
```

## 🧹 Maintenance

### Automatic Cleanup
The application automatically cleans up files older than 24 hours. You can also set up a cron job:

```bash
0 * * * * php /path/to/cleanup.php
```

### Database Optimization
```sql
OPTIMIZE TABLE pdf_history;
```

## 🐛 Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   ```bash
   chmod 755 public/uploads public/downloads
   ```

2. **Database Connection Failed**
   - Check credentials in `config/database.php`
   - Ensure MySQL service is running
   - Verify database exists

3. **PDF Generation Fails**
   - Check PHP memory limit
   - Verify Composer dependencies installed
   - Check error logs

4. **File Upload Issues**
   - Check `upload_max_filesize` in php.ini
   - Verify `post_max_size` setting
   - Ensure upload directory is writable

## 📄 License

MIT License

## 🤝 Support

For issues or questions, please check the documentation or create an issue in the repository.

## 🎉 Credits

Built with:
- TCPDF - PDF generation
- DomPDF - HTML to PDF conversion
- Tailwind CSS - Styling
- Font Awesome - Icons