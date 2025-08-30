import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDownload, FiLayers, FiUpload, FiX, FiFile } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PDFMerger = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => 
      file.type === 'application/pdf'
    );
    
    if (pdfFiles.length !== acceptedFiles.length) {
      toast.error('Some files were not PDFs and were skipped');
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
    toast.success(`${pdfFiles.length} PDF(s) added`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < files.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length < 2) {
      toast.error('Please add at least 2 PDF files to merge');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('pdfs', file);
    });

    try {
      const response = await axios.post('/api/pdf/merge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDFs merged successfully!');
      setFiles([]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to merge PDFs');
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
          <FiLayers /> Merge PDFs
        </h2>
        <p className="component-description">
          Combine multiple PDF files into one document
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
              ? 'Drop the PDFs here...'
              : 'Drag & drop PDF files here, or click to select'}
          </p>
          <p className="dropzone-hint">
            Only PDF files are accepted
          </p>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h3 style={{ marginBottom: '1rem' }}>
              PDF Files ({files.length}) - Drag to reorder
            </h3>
            <div className="merge-info">
              Files will be merged in the order shown below
            </div>
            
            {files.map((file, index) => (
              <motion.div 
                key={index}
                className="pdf-file-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="file-order">{index + 1}</div>
                <div className="file-info">
                  <FiFile style={{ color: '#e53e3e' }} />
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({formatFileSize(file.size)})</span>
                </div>
                <div className="file-actions">
                  <button
                    type="button"
                    onClick={() => moveFile(index, 'up')}
                    className="move-btn"
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(index, 'down')}
                    className="move-btn"
                    disabled={index === files.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="remove-file"
                  >
                    <FiX />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || files.length < 2}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Merging...
              </>
            ) : (
              <>
                <FiDownload />
                Merge PDFs
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

      <style jsx>{`
        .merge-info {
          padding: 0.75rem;
          background: #edf2f7;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          color: #4a5568;
          font-size: 0.9rem;
          text-align: center;
        }

        .pdf-file-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: #f7fafc;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .pdf-file-item:hover {
          border-color: #cbd5e0;
          background: white;
        }

        .file-order {
          width: 30px;
          height: 30px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .file-actions {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }

        .move-btn {
          width: 30px;
          height: 30px;
          border: 1px solid #cbd5e0;
          background: white;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .move-btn:hover:not(:disabled) {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .move-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .pdf-file-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .file-actions {
            margin-left: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PDFMerger;