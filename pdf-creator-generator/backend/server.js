const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function to generate unique filename
const generateFilename = (prefix = 'pdf') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`;
};

// Route: Generate PDF from text
app.post('/api/pdf/text', async (req, res) => {
  try {
    const { 
      content, 
      title = 'Document',
      fontSize = 12,
      fontFamily = 'Helvetica',
      margin = 50,
      pageSize = 'A4',
      color = '#000000'
    } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const filename = generateFilename('text');
    const filepath = path.join(outputDir, filename);
    
    // Create PDF document
    const doc = new PDFDocument({ 
      size: pageSize,
      margin: margin 
    });
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Add title
    doc.fontSize(20)
       .fillColor(color)
       .text(title, { align: 'center' })
       .moveDown(2);
    
    // Add content
    doc.fontSize(fontSize)
       .font(fontFamily)
       .text(content, {
         align: 'justify',
         lineGap: 5
       });
    
    doc.end();
    
    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) console.error('Download error:', err);
        // Clean up file after download
        setTimeout(() => {
          fs.unlink(filepath, (err) => {
            if (err) console.error('Cleanup error:', err);
          });
        }, 5000);
      });
    });
    
  } catch (error) {
    console.error('Error generating text PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Route: Generate PDF from HTML
app.post('/api/pdf/html', async (req, res) => {
  try {
    const { html, options = {} } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    const filename = generateFilename('html');
    const filepath = path.join(outputDir, filename);
    
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
      path: filepath,
      format: options.format || 'A4',
      printBackground: true,
      margin: options.margin || {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    await browser.close();
    
    res.download(filepath, filename, (err) => {
      if (err) console.error('Download error:', err);
      // Clean up file after download
      setTimeout(() => {
        fs.unlink(filepath, (err) => {
          if (err) console.error('Cleanup error:', err);
        });
      }, 5000);
    });
    
  } catch (error) {
    console.error('Error generating HTML PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF from HTML' });
  }
});

// Route: Generate PDF from images
app.post('/api/pdf/images', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const filename = generateFilename('images');
    const filepath = path.join(outputDir, filename);
    
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    for (const file of req.files) {
      // Get image dimensions
      const metadata = await sharp(file.path).metadata();
      
      // Add page with appropriate size
      doc.addPage({ 
        size: [metadata.width, metadata.height]
      });
      
      // Add image to page
      doc.image(file.path, 0, 0, {
        width: metadata.width,
        height: metadata.height
      });
      
      // Clean up uploaded file
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    doc.end();
    
    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) console.error('Download error:', err);
        // Clean up file after download
        setTimeout(() => {
          fs.unlink(filepath, (err) => {
            if (err) console.error('Cleanup error:', err);
          });
        }, 5000);
      });
    });
    
  } catch (error) {
    console.error('Error generating images PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF from images' });
  }
});

// Route: Generate PDF with form
app.post('/api/pdf/form', async (req, res) => {
  try {
    const { formData, template } = req.body;
    
    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    const filename = generateFilename('form');
    const filepath = path.join(outputDir, filename);
    
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Add form title
    doc.fontSize(24)
       .text(template || 'Form Document', { align: 'center' })
       .moveDown(2);
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(`${key}:`, { continued: true })
         .font('Helvetica')
         .text(` ${value}`)
         .moveDown(0.5);
    });
    
    // Add timestamp
    doc.moveDown(2)
       .fontSize(10)
       .fillColor('#666666')
       .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    
    doc.end();
    
    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) console.error('Download error:', err);
        // Clean up file after download
        setTimeout(() => {
          fs.unlink(filepath, (err) => {
            if (err) console.error('Cleanup error:', err);
          });
        }, 5000);
      });
    });
    
  } catch (error) {
    console.error('Error generating form PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF from form' });
  }
});

// Route: Generate invoice PDF
app.post('/api/pdf/invoice', async (req, res) => {
  try {
    const { 
      invoiceNumber,
      date,
      dueDate,
      from,
      to,
      items,
      tax = 0,
      discount = 0,
      notes
    } = req.body;

    const filename = generateFilename('invoice');
    const filepath = path.join(outputDir, filename);
    
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Header
    doc.fontSize(20)
       .text('INVOICE', { align: 'center' })
       .moveDown();
    
    // Invoice details
    doc.fontSize(10);
    doc.text(`Invoice #: ${invoiceNumber}`, { align: 'right' });
    doc.text(`Date: ${date}`, { align: 'right' });
    doc.text(`Due Date: ${dueDate}`, { align: 'right' });
    doc.moveDown();
    
    // From and To sections
    const startY = doc.y;
    doc.text('FROM:', 50, startY);
    doc.fontSize(10).text(from.name, 50, startY + 15);
    doc.text(from.address, 50, startY + 30);
    doc.text(from.email, 50, startY + 45);
    
    doc.text('TO:', 300, startY);
    doc.text(to.name, 300, startY + 15);
    doc.text(to.address, 300, startY + 30);
    doc.text(to.email, 300, startY + 45);
    
    doc.moveDown(4);
    
    // Items table
    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Item', 50, tableTop);
    doc.text('Quantity', 250, tableTop);
    doc.text('Price', 350, tableTop);
    doc.text('Total', 450, tableTop);
    
    doc.moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();
    
    let yPosition = tableTop + 25;
    let subtotal = 0;
    
    doc.font('Helvetica');
    items.forEach(item => {
      const total = item.quantity * item.price;
      subtotal += total;
      
      doc.text(item.description, 50, yPosition);
      doc.text(item.quantity.toString(), 250, yPosition);
      doc.text(`$${item.price.toFixed(2)}`, 350, yPosition);
      doc.text(`$${total.toFixed(2)}`, 450, yPosition);
      
      yPosition += 20;
    });
    
    // Totals
    doc.moveTo(50, yPosition)
       .lineTo(550, yPosition)
       .stroke();
    
    yPosition += 10;
    doc.text('Subtotal:', 350, yPosition);
    doc.text(`$${subtotal.toFixed(2)}`, 450, yPosition);
    
    if (discount > 0) {
      yPosition += 20;
      doc.text(`Discount (${discount}%):`, 350, yPosition);
      const discountAmount = subtotal * (discount / 100);
      doc.text(`-$${discountAmount.toFixed(2)}`, 450, yPosition);
      subtotal -= discountAmount;
    }
    
    if (tax > 0) {
      yPosition += 20;
      doc.text(`Tax (${tax}%):`, 350, yPosition);
      const taxAmount = subtotal * (tax / 100);
      doc.text(`$${taxAmount.toFixed(2)}`, 450, yPosition);
      subtotal += taxAmount;
    }
    
    yPosition += 20;
    doc.font('Helvetica-Bold');
    doc.text('Total:', 350, yPosition);
    doc.text(`$${subtotal.toFixed(2)}`, 450, yPosition);
    
    // Notes
    if (notes) {
      doc.moveDown(2);
      doc.font('Helvetica');
      doc.fontSize(10);
      doc.text('Notes:', 50);
      doc.text(notes, 50);
    }
    
    doc.end();
    
    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) console.error('Download error:', err);
        // Clean up file after download
        setTimeout(() => {
          fs.unlink(filepath, (err) => {
            if (err) console.error('Cleanup error:', err);
          });
        }, 5000);
      });
    });
    
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ error: 'Failed to generate invoice PDF' });
  }
});

// Route: Merge PDFs
app.post('/api/pdf/merge', upload.array('pdfs', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files are required' });
    }

    const filename = generateFilename('merged');
    const filepath = path.join(outputDir, filename);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Note: For production, you'd want to use a proper PDF merging library
    // This is a simplified version
    for (const file of req.files) {
      doc.addPage();
      doc.text(`Content from: ${file.originalname}`, 50, 50);
      
      // Clean up uploaded file
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    doc.end();
    await browser.close();
    
    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) console.error('Download error:', err);
        // Clean up file after download
        setTimeout(() => {
          fs.unlink(filepath, (err) => {
            if (err) console.error('Cleanup error:', err);
          });
        }, 5000);
      });
    });
    
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PDF Creator API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});