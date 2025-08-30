import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDownload, FiDollarSign, FiPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const InvoiceGenerator = () => {
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from: {
      name: '',
      address: '',
      email: ''
    },
    to: {
      name: '',
      address: '',
      email: ''
    },
    items: [
      { description: '', quantity: 1, price: 0 }
    ],
    tax: 0,
    discount: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const updateInvoice = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFrom = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      from: { ...prev.from, [field]: value }
    }));
  };

  const updateTo = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      to: { ...prev.to, [field]: value }
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (invoice.items.length > 1) {
      setInvoice(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = field === 'description' ? value : Number(value);
    setInvoice(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * (invoice.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (invoice.tax / 100);
    return afterDiscount + taxAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!invoice.from.name || !invoice.to.name) {
      toast.error('Please fill in both From and To information');
      return;
    }

    if (invoice.items.filter(item => item.description).length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/pdf/invoice', invoice, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Invoice generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setInvoice({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      from: {
        name: 'Your Company Inc.',
        address: '123 Business St, Suite 100, New York, NY 10001',
        email: 'billing@yourcompany.com'
      },
      to: {
        name: 'Client Corporation',
        address: '456 Client Ave, Office 200, Los Angeles, CA 90001',
        email: 'accounts@clientcorp.com'
      },
      items: [
        { description: 'Web Development Services', quantity: 40, price: 150 },
        { description: 'UI/UX Design', quantity: 20, price: 125 },
        { description: 'Project Management', quantity: 10, price: 100 }
      ],
      tax: 10,
      discount: 5,
      notes: 'Thank you for your business! Payment is due within 30 days.'
    });
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
          <FiDollarSign /> Invoice Generator
        </h2>
        <p className="component-description">
          Create professional invoices with automatic calculations
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button 
            type="button"
            onClick={loadSampleData}
            className="btn btn-secondary"
          >
            Load Sample Data
          </button>
        </div>

        <div className="invoice-details">
          <h3>Invoice Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Invoice Number</label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => updateInvoice('invoiceNumber', e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={invoice.date}
                onChange={(e) => updateInvoice('date', e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => updateInvoice('dueDate', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="invoice-parties">
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <h3>From</h3>
              <input
                type="text"
                placeholder="Company Name"
                value={invoice.from.name}
                onChange={(e) => updateFrom('name', e.target.value)}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={invoice.from.address}
                onChange={(e) => updateFrom('address', e.target.value)}
                className="form-input"
                style={{ marginTop: '0.5rem' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={invoice.from.email}
                onChange={(e) => updateFrom('email', e.target.value)}
                className="form-input"
                style={{ marginTop: '0.5rem' }}
              />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <h3>To</h3>
              <input
                type="text"
                placeholder="Client Name"
                value={invoice.to.name}
                onChange={(e) => updateTo('name', e.target.value)}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={invoice.to.address}
                onChange={(e) => updateTo('address', e.target.value)}
                className="form-input"
                style={{ marginTop: '0.5rem' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={invoice.to.email}
                onChange={(e) => updateTo('email', e.target.value)}
                className="form-input"
                style={{ marginTop: '0.5rem' }}
              />
            </div>
          </div>
        </div>

        <div className="invoice-items">
          <h3>Items</h3>
          <div className="items-header">
            <span style={{ flex: 3 }}>Description</span>
            <span style={{ flex: 1 }}>Quantity</span>
            <span style={{ flex: 1 }}>Price</span>
            <span style={{ flex: 1 }}>Total</span>
            <span style={{ width: '40px' }}></span>
          </div>
          
          {invoice.items.map((item, index) => (
            <motion.div 
              key={index}
              className="item-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <input
                type="text"
                placeholder="Item description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="form-input"
                style={{ flex: 3 }}
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                className="form-input"
                min="1"
                style={{ flex: 1 }}
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', e.target.value)}
                className="form-input"
                min="0"
                step="0.01"
                style={{ flex: 1 }}
              />
              <div style={{ flex: 1, padding: '0.75rem', textAlign: 'right' }}>
                ${(item.quantity * item.price).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="btn btn-danger"
                disabled={invoice.items.length === 1}
              >
                <FiX />
              </button>
            </motion.div>
          ))}
          
          <button
            type="button"
            onClick={addItem}
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            <FiPlus /> Add Item
          </button>
        </div>

        <div className="invoice-totals">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Discount (%)</label>
              <input
                type="number"
                value={invoice.discount}
                onChange={(e) => updateInvoice('discount', Number(e.target.value))}
                className="form-input"
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tax (%)</label>
              <input
                type="number"
                value={invoice.tax}
                onChange={(e) => updateInvoice('tax', Number(e.target.value))}
                className="form-input"
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="totals-summary">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="total-line">
                <span>Discount ({invoice.discount}%):</span>
                <span>-${(calculateSubtotal() * invoice.discount / 100).toFixed(2)}</span>
              </div>
            )}
            {invoice.tax > 0 && (
              <div className="total-line">
                <span>Tax ({invoice.tax}%):</span>
                <span>${((calculateSubtotal() - calculateSubtotal() * invoice.discount / 100) * invoice.tax / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="total-line total-final">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            value={invoice.notes}
            onChange={(e) => updateInvoice('notes', e.target.value)}
            className="form-textarea"
            placeholder="Additional notes or payment instructions..."
            rows="3"
          />
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
              Generate Invoice
            </>
          )}
        </button>
      </form>

      <style jsx>{`
        .invoice-details, .invoice-parties, .invoice-items, .invoice-totals {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f7fafc;
          border-radius: 0.5rem;
        }

        .invoice-details h3, .invoice-parties h3, .invoice-items h3 {
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .items-header {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #4a5568;
        }

        .item-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .totals-summary {
          max-width: 400px;
          margin-left: auto;
          margin-top: 1rem;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .total-final {
          font-weight: 600;
          font-size: 1.2rem;
          color: #2d3748;
          border-bottom: 2px solid #667eea;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .item-row {
            flex-direction: column;
          }
          
          .items-header {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default InvoiceGenerator;