# PDF Creator Generator

A comprehensive web application for creating and generating PDF documents from various sources with a modern, user-friendly interface.

## Features

- **Text to PDF**: Convert plain text into professionally formatted PDF documents
- **HTML to PDF**: Transform HTML content with CSS styling into PDFs
- **Images to PDF**: Combine multiple images into a single PDF document
- **Form to PDF**: Generate PDFs from form data with custom templates
- **Invoice Generator**: Create professional invoices with automatic calculations
- **PDF Merger**: Combine multiple PDF files into one document

## Tech Stack

### Backend
- Node.js with Express.js
- PDFKit for PDF generation
- Puppeteer for HTML to PDF conversion
- Sharp for image processing
- Multer for file uploads

### Frontend
- React 18
- React Router for navigation
- Framer Motion for animations
- React Dropzone for file uploads
- Axios for API calls
- React Hot Toast for notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. Clone the repository:
```bash
cd /workspace/pdf-creator-generator
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

### Option 1: Run Backend and Frontend Separately

1. Start the backend server:
```bash
cd backend
npm start
```
The backend will run on http://localhost:5000

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

### Option 2: Use the Startup Script

Run the provided startup script:
```bash
chmod +x start.sh
./start.sh
```

## API Endpoints

- `POST /api/pdf/text` - Generate PDF from text
- `POST /api/pdf/html` - Generate PDF from HTML
- `POST /api/pdf/images` - Generate PDF from images
- `POST /api/pdf/form` - Generate PDF from form data
- `POST /api/pdf/invoice` - Generate invoice PDF
- `POST /api/pdf/merge` - Merge multiple PDFs
- `GET /api/health` - Health check endpoint

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Select the type of PDF you want to create from the navigation menu
3. Fill in the required information or upload files
4. Click "Generate PDF" to download your document

## Features Details

### Text to PDF
- Customizable fonts and sizes
- Multiple page sizes (A4, A3, Letter, Legal)
- Color selection for text
- Adjustable margins

### HTML to PDF
- Full CSS support
- Sample HTML template provided
- Preview before conversion
- Multiple page formats

### Images to PDF
- Drag and drop interface
- Support for multiple image formats (PNG, JPG, GIF, BMP, WebP)
- Automatic page sizing based on image dimensions

### Form to PDF
- Multiple form templates
- Dynamic field addition
- Sample data loading
- Professional formatting

### Invoice Generator
- Automatic calculations
- Tax and discount support
- Multiple line items
- Professional layout

### PDF Merger
- Drag and drop PDFs
- Reorder files before merging
- Visual file management

## Security Notes

- Files are automatically cleaned up after processing
- No files are permanently stored on the server
- All uploads are processed in memory when possible

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.