import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDownload, FiImage, FiUpload, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ImagesToPDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.error('Some files were not images and were skipped');
    }
    
    setFiles(prev => [...prev, ...imageFiles]);
    toast.success(`${imageFiles.length} image(s) added`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/api/pdf/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'images.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF generated successfully!');
      setFiles([]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
          <FiImage /> Images to PDF
        </h2>
        <p className="component-description">
          Combine multiple images into a single PDF document
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <FiUpload className="dropzone-icon" />
          <p className="dropzone-text">
            {isDragActive
              ? 'Drop the images here...'
              : 'Drag & drop images here, or click to select'}
          </p>
          <p className="dropzone-hint">
            Supports: PNG, JPG, JPEG, GIF, BMP, WebP
          </p>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h3 style={{ marginBottom: '1rem' }}>
              Selected Images ({files.length})
            </h3>
            {files.map((file, index) => (
              <motion.div 
                key={index}
                className="file-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="file-info">
                  <FiImage style={{ color: '#667eea' }} />
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({formatFileSize(file.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="remove-file"
                >
                  <FiX />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || files.length === 0}
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

          {files.length > 0 && (
            <button
              type="button"
              onClick={() => setFiles([])}
              className="btn btn-secondary"
            >
              Clear All
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ImagesToPDF;