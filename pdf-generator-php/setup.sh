#!/bin/bash

echo "🚀 PDF Generator PHP Setup Script"
echo "=================================="
echo ""

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 7.4 or higher."
    exit 1
fi

echo "✅ PHP version: $(php -v | head -n 1)"
echo ""

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "📦 Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    echo "✅ Composer installed"
else
    echo "✅ Composer is already installed"
fi
echo ""

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader
echo "✅ Dependencies installed"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL/MariaDB."
    echo "   You can skip database setup if you want to use file-based storage only."
    read -p "Continue without database? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "🔧 Setting up database..."
    read -p "Enter MySQL username (default: root): " db_user
    db_user=${db_user:-root}
    
    read -sp "Enter MySQL password: " db_pass
    echo
    
    # Create database
    mysql -u "$db_user" -p"$db_pass" < database/schema.sql 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
        
        # Update database config
        if [ "$db_user" != "root" ] || [ ! -z "$db_pass" ]; then
            echo "Updating database configuration..."
            sed -i "s/define('DB_USER', 'root');/define('DB_USER', '$db_user');/" config/database.php
            sed -i "s/define('DB_PASS', '');/define('DB_PASS', '$db_pass');/" config/database.php
            echo "✅ Database configuration updated"
        fi
    else
        echo "⚠️  Could not create database. Please check your credentials."
        echo "   You can manually import database/schema.sql later."
    fi
fi
echo ""

# Create required directories
echo "📁 Creating directories..."
mkdir -p public/uploads public/downloads
chmod 755 public/uploads public/downloads
echo "✅ Directories created"
echo ""

# Set permissions
echo "🔒 Setting permissions..."
chmod 755 api/*.php
chmod 644 public/index.php
chmod 644 public/js/*.js
echo "✅ Permissions set"
echo ""

echo "========================================="
echo "✅ Setup complete!"
echo "========================================="
echo ""
echo "To start using the PDF Generator:"
echo ""
echo "1. Using PHP built-in server:"
echo "   php -S localhost:8000 -t public/"
echo ""
echo "2. Using Apache/Nginx:"
echo "   - Point your document root to: $(pwd)/public"
echo "   - Access the application at: http://your-domain.com"
echo ""
echo "3. For production:"
echo "   - Update config/database.php with your database credentials"
echo "   - Set appropriate file permissions"
echo "   - Configure your web server"
echo ""
echo "📋 Features available:"
echo "   • Text to PDF"
echo "   • HTML to PDF"
echo "   • Images to PDF"
echo "   • Form to PDF"
echo "   • Invoice Generator"
echo "   • PDF Merger"
echo ""
echo "Enjoy creating PDFs! 🎉"