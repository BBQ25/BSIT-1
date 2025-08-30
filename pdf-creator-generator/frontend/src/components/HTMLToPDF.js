import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDownload, FiCode } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HTMLToPDF = () => {
  const [html, setHtml] = useState('');
  const [options, setOptions] = useState({
    format: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const sampleHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .content { margin-top: 20px; line-height: 1.6; }
    .highlight { background-color: #fffacd; padding: 2px 4px; }
  </style>
</head>
<body>
  <h1>Sample Document</h1>
  <div class="content">
    <p>This is a <span class="highlight">sample HTML document</span> that will be converted to PDF.</p>
    <ul>
      <li>Supports CSS styling</li>
      <li>Preserves formatting</li>
      <li>Includes images and tables</li>
    </ul>
  </div>
</body>
</html>`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!html) {
      toast.error('Please enter HTML content');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/pdf/html', 
        { html, options },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'html-document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setHtml(sampleHTML);
    toast.success('Sample HTML loaded!');
  };

  return (
    <motion.div 
      className="component-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="component-header">
        <h2 className="component-title">
          <FiCode /> HTML to PDF
        </h2>
        <p className="component-description">
          Convert HTML content with CSS styling into PDF documents
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">HTML Content *</label>
            <button 
              type="button"
              onClick={loadSample}
              className="btn btn-secondary"
              style={{ marginBottom: '0.5rem' }}
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="form-textarea"
            placeholder="Enter your HTML content here..."
            rows="15"
            required
            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Page Format</label>
            <select
              value={options.format}
              onChange={(e) => setOptions({...options, format: e.target.value})}
              className="form-select"
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="Tabloid">Tabloid</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={preview}
              onChange={(e) => setPreview(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Preview HTML before conversion
          </label>
        </div>

        {preview && html && (
          <div className="html-preview">
            <h3>Preview:</h3>
            <div 
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1rem',
                background: 'white',
                maxHeight: '400px',
                overflow: 'auto'
              }}
            />
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Generating...
            </>
          ) : (
            <>
              <FiDownload />
              Generate PDF
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default HTMLToPDF;