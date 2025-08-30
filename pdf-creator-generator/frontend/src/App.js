import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiCode, 
  FiImage, 
  FiFile, 
  FiDollarSign,
  FiLayers,
  FiHome
} from 'react-icons/fi';
import './styles/App.css';

// Import components
import HomePage from './components/HomePage';
import TextToPDF from './components/TextToPDF';
import HTMLToPDF from './components/HTMLToPDF';
import ImagesToPDF from './components/ImagesToPDF';
import FormToPDF from './components/FormToPDF';
import InvoiceGenerator from './components/InvoiceGenerator';
import PDFMerger from './components/PDFMerger';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: FiHome, path: '/' },
    { id: 'text', label: 'Text to PDF', icon: FiFileText, path: '/text' },
    { id: 'html', label: 'HTML to PDF', icon: FiCode, path: '/html' },
    { id: 'images', label: 'Images to PDF', icon: FiImage, path: '/images' },
    { id: 'form', label: 'Form to PDF', icon: FiFile, path: '/form' },
    { id: 'invoice', label: 'Invoice Generator', icon: FiDollarSign, path: '/invoice' },
    { id: 'merge', label: 'Merge PDFs', icon: FiLayers, path: '/merge' }
  ];

  return (
    <Router>
      <div className="app">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4CAF50',
                secondary: 'black',
              },
            },
          }}
        />
        
        <header className="app-header">
          <div className="header-container">
            <motion.div 
              className="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FiFileText className="logo-icon" />
              <h1>PDF Creator Pro</h1>
            </motion.div>
            
            <nav className="nav-menu">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="nav-content"
                  >
                    <item.icon className="nav-icon" />
                    <span>{item.label}</span>
                  </motion.div>
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/text" element={<TextToPDF />} />
            <Route path="/html" element={<HTMLToPDF />} />
            <Route path="/images" element={<ImagesToPDF />} />
            <Route path="/form" element={<FormToPDF />} />
            <Route path="/invoice" element={<InvoiceGenerator />} />
            <Route path="/merge" element={<PDFMerger />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2024 PDF Creator Pro. Create professional PDFs with ease.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;