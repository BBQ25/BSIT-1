import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiCode, 
  FiImage, 
  FiFile, 
  FiDollarSign,
  FiLayers,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';

const HomePage = () => {
  const features = [
    {
      icon: FiFileText,
      title: 'Text to PDF',
      description: 'Convert plain text into professionally formatted PDF documents',
      path: '/text',
      color: '#667eea'
    },
    {
      icon: FiCode,
      title: 'HTML to PDF',
      description: 'Transform HTML content with CSS styling into PDFs',
      path: '/html',
      color: '#f56565'
    },
    {
      icon: FiImage,
      title: 'Images to PDF',
      description: 'Combine multiple images into a single PDF document',
      path: '/images',
      color: '#48bb78'
    },
    {
      icon: FiFile,
      title: 'Form to PDF',
      description: 'Generate PDFs from form data with custom templates',
      path: '/form',
      color: '#ed8936'
    },
    {
      icon: FiDollarSign,
      title: 'Invoice Generator',
      description: 'Create professional invoices with automatic calculations',
      path: '/invoice',
      color: '#9f7aea'
    },
    {
      icon: FiLayers,
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      path: '/merge',
      color: '#38b2ac'
    }
  ];

  const benefits = [
    'No registration required',
    'Fast processing',
    'Secure & private',
    'Multiple formats supported',
    'Professional templates',
    'Free to use'
  ];

  return (
    <div className="home-page">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="hero-title">
          Create Professional PDFs in Seconds
        </h1>
        <p className="hero-subtitle">
          Transform your content into high-quality PDF documents with our powerful suite of tools
        </p>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              className="benefit-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FiCheck className="benefit-icon" />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link to={feature.path} className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: `${feature.color}20` }}>
                <feature.icon style={{ color: feature.color }} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-action">
                <span>Get Started</span>
                <FiArrowRight />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .home-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #718096;
          margin-bottom: 2rem;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f7fafc;
          border-radius: 0.5rem;
        }

        .benefit-icon {
          color: #48bb78;
          font-size: 1.25rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          display: block;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.75rem;
        }

        .feature-description {
          color: #718096;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .feature-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;