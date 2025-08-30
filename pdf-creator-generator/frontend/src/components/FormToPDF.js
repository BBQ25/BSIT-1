import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDownload, FiFile, FiPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FormToPDF = () => {
  const [template, setTemplate] = useState('Application Form');
  const [fields, setFields] = useState([
    { key: 'Full Name', value: '' },
    { key: 'Email', value: '' },
    { key: 'Phone', value: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const templates = [
    'Application Form',
    'Registration Form',
    'Contact Form',
    'Survey Form',
    'Feedback Form',
    'Custom Form'
  ];

  const addField = () => {
    setFields([...fields, { key: '', value: '' }]);
  };

  const removeField = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const updateField = (index, field, value) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validFields = fields.filter(f => f.key && f.value);
    if (validFields.length === 0) {
      toast.error('Please fill in at least one field');
      return;
    }

    setLoading(true);
    try {
      const formData = {};
      validFields.forEach(field => {
        formData[field.key] = field.value;
      });

      const response = await axios.post('/api/pdf/form', 
        { formData, template },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${template.toLowerCase().replace(' ', '-')}.pdf`);
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

  const loadSampleData = () => {
    setFields([
      { key: 'Full Name', value: 'John Doe' },
      { key: 'Email', value: 'john.doe@example.com' },
      { key: 'Phone', value: '+1 (555) 123-4567' },
      { key: 'Address', value: '123 Main St, New York, NY 10001' },
      { key: 'Date of Birth', value: '01/15/1990' },
      { key: 'Occupation', value: 'Software Developer' }
    ]);
    toast.success('Sample data loaded!');
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
          <FiFile /> Form to PDF
        </h2>
        <p className="component-description">
          Generate PDFs from form data with custom templates
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="form-select"
          >
            {templates.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Form Fields</label>
            <button 
              type="button"
              onClick={loadSampleData}
              className="btn btn-secondary"
              style={{ marginBottom: '0.5rem' }}
            >
              Load Sample Data
            </button>
          </div>
          
          <div className="form-fields">
            {fields.map((field, index) => (
              <motion.div 
                key={index}
                className="form-field-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <input
                  type="text"
                  placeholder="Field name"
                  value={field.key}
                  onChange={(e) => updateField(index, 'key', e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="Field value"
                  value={field.value}
                  onChange={(e) => updateField(index, 'value', e.target.value)}
                  className="form-input"
                  style={{ flex: 2 }}
                />
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="btn btn-danger"
                  disabled={fields.length === 1}
                >
                  <FiX />
                </button>
              </motion.div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addField}
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            <FiPlus /> Add Field
          </button>
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

      <style jsx>{`
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-field-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          .form-field-row {
            flex-direction: column;
          }
          
          .form-field-row input {
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default FormToPDF;