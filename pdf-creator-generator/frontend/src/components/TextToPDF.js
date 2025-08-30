import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDownload, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TextToPDF = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    fontSize: 12,
    fontFamily: 'Helvetica',
    margin: 50,
    pageSize: 'A4',
    color: '#000000'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content) {
      toast.error('Please enter some text content');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/pdf/text', formData, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.title || 'document'}.pdf`);
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

  return (
    <motion.div 
      className="component-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="component-header">
        <h2 className="component-title">
          <FiFileText /> Text to PDF
        </h2>
        <p className="component-description">
          Convert your text content into a professionally formatted PDF document
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Document Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter document title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter your text content here..."
            rows="10"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Font Size</label>
            <input
              type="number"
              name="fontSize"
              value={formData.fontSize}
              onChange={handleChange}
              className="form-input"
              min="8"
              max="72"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Font Family</label>
            <select
              name="fontFamily"
              value={formData.fontFamily}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Helvetica">Helvetica</option>
              <option value="Times-Roman">Times Roman</option>
              <option value="Courier">Courier</option>
              <option value="Helvetica-Bold">Helvetica Bold</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Page Size</label>
            <select
              name="pageSize"
              value={formData.pageSize}
              onChange={handleChange}
              className="form-select"
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Text Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="color-picker"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
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

export default TextToPDF;