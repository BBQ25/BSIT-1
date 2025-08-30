// PDF Generator Application JavaScript

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.remove('hidden');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('tab-active');
        }
    });
    
    // Hide mobile menu
    document.getElementById('mobileMenu').classList.add('hidden');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Load sample HTML
function loadSampleHTML() {
    const sampleHTML = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .highlight {
            background-color: #fffacd;
            padding: 2px 4px;
        }
        .section {
            margin: 20px 0;
        }
        ul {
            margin-left: 20px;
        }
    </style>
</head>
<body>
    <h1>Sample Document</h1>
    <div class="section">
        <p>This is a <span class="highlight">sample HTML document</span> that will be converted to PDF.</p>
        <h2>Features</h2>
        <ul>
            <li>Supports CSS styling</li>
            <li>Preserves formatting</li>
            <li>Includes images and tables</li>
        </ul>
    </div>
    <div class="section">
        <h2>Table Example</h2>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f0f0f0;">
                <th style="padding: 8px;">Name</th>
                <th style="padding: 8px;">Value</th>
            </tr>
            <tr>
                <td style="padding: 8px;">Item 1</td>
                <td style="padding: 8px;">100</td>
            </tr>
            <tr>
                <td style="padding: 8px;">Item 2</td>
                <td style="padding: 8px;">200</td>
            </tr>
        </table>
    </div>
</body>
</html>`;
    
    document.querySelector('#htmlForm textarea[name="html"]').value = sampleHTML;
    showToast('Sample HTML loaded!');
}

// Load sample form data
function loadSampleFormData() {
    const fields = [
        { key: 'Full Name', value: 'John Doe' },
        { key: 'Email', value: 'john.doe@example.com' },
        { key: 'Phone', value: '+1 (555) 123-4567' },
        { key: 'Address', value: '123 Main St, New York, NY 10001' },
        { key: 'Date of Birth', value: '01/15/1990' },
        { key: 'Occupation', value: 'Software Developer' }
    ];
    
    const container = document.getElementById('formFields');
    container.innerHTML = '';
    
    fields.forEach(field => {
        const row = document.createElement('div');
        row.className = 'form-field-row flex gap-2';
        row.innerHTML = `
            <input type="text" placeholder="Field name" value="${field.key}" class="field-key flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <input type="text" placeholder="Field value" value="${field.value}" class="field-value flex-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <button type="button" onclick="removeFormField(this)" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(row);
    });
    
    showToast('Sample data loaded!');
}

// Add form field
function addFormField() {
    const container = document.getElementById('formFields');
    const row = document.createElement('div');
    row.className = 'form-field-row flex gap-2';
    row.innerHTML = `
        <input type="text" placeholder="Field name" class="field-key flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
        <input type="text" placeholder="Field value" class="field-value flex-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
        <button type="button" onclick="removeFormField(this)" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(row);
}

// Remove form field
function removeFormField(button) {
    button.parentElement.remove();
}

// Load sample invoice
function loadSampleInvoice() {
    document.querySelector('input[name="invoiceNumber"]').value = 'INV-' + Date.now().toString().slice(-6);
    document.querySelector('input[name="date"]').value = new Date().toISOString().split('T')[0];
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.querySelector('input[name="dueDate"]').value = dueDate.toISOString().split('T')[0];
    
    document.querySelector('input[name="fromName"]').value = 'Your Company Inc.';
    document.querySelector('input[name="fromAddress"]').value = '123 Business St, Suite 100, New York, NY 10001';
    document.querySelector('input[name="fromEmail"]').value = 'billing@yourcompany.com';
    
    document.querySelector('input[name="toName"]').value = 'Client Corporation';
    document.querySelector('input[name="toAddress"]').value = '456 Client Ave, Office 200, Los Angeles, CA 90001';
    document.querySelector('input[name="toEmail"]').value = 'accounts@clientcorp.com';
    
    const items = [
        { description: 'Web Development Services', quantity: 40, price: 150 },
        { description: 'UI/UX Design', quantity: 20, price: 125 },
        { description: 'Project Management', quantity: 10, price: 100 }
    ];
    
    const container = document.getElementById('invoiceItems');
    container.innerHTML = '';
    
    items.forEach(item => {
        addInvoiceItem();
        const lastItem = container.lastElementChild;
        lastItem.querySelector('.item-desc').value = item.description;
        lastItem.querySelector('.item-qty').value = item.quantity;
        lastItem.querySelector('.item-price').value = item.price;
    });
    
    document.querySelector('input[name="discount"]').value = 5;
    document.querySelector('input[name="tax"]').value = 10;
    document.querySelector('textarea[name="notes"]').value = 'Thank you for your business! Payment is due within 30 days.';
    
    calculateInvoiceTotals();
    showToast('Sample invoice loaded!');
}

// Add invoice item
function addInvoiceItem() {
    const container = document.getElementById('invoiceItems');
    const row = document.createElement('div');
    row.className = 'invoice-item grid grid-cols-12 gap-2';
    row.innerHTML = `
        <input type="text" placeholder="Item description" class="item-desc col-span-5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
        <input type="number" value="1" min="1" class="item-qty col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center">
        <input type="number" value="0" min="0" step="0.01" class="item-price col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right">
        <div class="item-total col-span-2 px-3 py-2 text-right">$0.00</div>
        <button type="button" onclick="removeInvoiceItem(this)" class="col-span-1 px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(row);
    
    // Add event listeners for calculation
    row.querySelector('.item-qty').addEventListener('input', calculateInvoiceTotals);
    row.querySelector('.item-price').addEventListener('input', calculateInvoiceTotals);
}

// Remove invoice item
function removeInvoiceItem(button) {
    const items = document.querySelectorAll('.invoice-item');
    if (items.length > 1) {
        button.parentElement.remove();
        calculateInvoiceTotals();
    } else {
        showToast('At least one item is required', 'error');
    }
}

// Calculate invoice totals
function calculateInvoiceTotals() {
    let subtotal = 0;
    
    document.querySelectorAll('.invoice-item').forEach(item => {
        const qty = parseFloat(item.querySelector('.item-qty').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const total = qty * price;
        item.querySelector('.item-total').textContent = `$${total.toFixed(2)}`;
        subtotal += total;
    });
    
    const discount = parseFloat(document.querySelector('input[name="discount"]').value) || 0;
    const tax = parseFloat(document.querySelector('input[name="tax"]').value) || 0;
    
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (tax / 100);
    const total = afterDiscount + taxAmount;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Text to PDF form
    document.getElementById('textForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        if (!data.content) {
            showToast('Please enter some text content', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/generate.php?type=text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = `/api/download.php?file=${result.filename}`;
                showToast('PDF generated successfully!');
            } else {
                showToast(result.message || 'Failed to generate PDF', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
            console.error(error);
        }
    });
    
    // HTML to PDF form
    document.getElementById('htmlForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        if (!data.html) {
            showToast('Please enter HTML content', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/generate.php?type=html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = `/api/download.php?file=${result.filename}`;
                showToast('PDF generated successfully!');
            } else {
                showToast(result.message || 'Failed to generate PDF', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
            console.error(error);
        }
    });
    
    // HTML preview
    document.getElementById('previewHTML').addEventListener('change', function(e) {
        const preview = document.getElementById('htmlPreview');
        const html = document.querySelector('textarea[name="html"]').value;
        
        if (e.target.checked && html) {
            preview.innerHTML = html;
            preview.classList.remove('hidden');
        } else {
            preview.classList.add('hidden');
        }
    });
    
    // Images dropzone
    const imageDropzone = document.getElementById('imageDropzone');
    const imageInput = imageDropzone.querySelector('input[type="file"]');
    const imagesList = document.getElementById('imagesList');
    let imageFiles = [];
    
    imageDropzone.addEventListener('click', () => imageInput.click());
    
    imageDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropzone.classList.add('dragover');
    });
    
    imageDropzone.addEventListener('dragleave', () => {
        imageDropzone.classList.remove('dragover');
    });
    
    imageDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropzone.classList.remove('dragover');
        handleImageFiles(e.dataTransfer.files);
    });
    
    imageInput.addEventListener('change', (e) => {
        handleImageFiles(e.target.files);
    });
    
    function handleImageFiles(files) {
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                imageFiles.push(file);
            }
        }
        updateImagesList();
    }
    
    function updateImagesList() {
        if (imageFiles.length > 0) {
            imagesList.classList.remove('hidden');
            imagesList.innerHTML = '<h3 class="font-semibold mb-2">Selected Images (' + imageFiles.length + ')</h3>';
            
            imageFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
                item.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-image text-green-600"></i>
                        <span>${file.name}</span>
                        <span class="text-sm text-gray-500">(${(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button type="button" onclick="removeImage(${index})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imagesList.appendChild(item);
            });
            
            document.querySelector('#imagesForm button[type="submit"]').disabled = false;
        } else {
            imagesList.classList.add('hidden');
            document.querySelector('#imagesForm button[type="submit"]').disabled = true;
        }
    }
    
    window.removeImage = function(index) {
        imageFiles.splice(index, 1);
        updateImagesList();
    };
    
    // Images form submission
    document.getElementById('imagesForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (imageFiles.length === 0) {
            showToast('Please select at least one image', 'error');
            return;
        }
        
        const formData = new FormData();
        imageFiles.forEach(file => {
            formData.append('images[]', file);
        });
        
        try {
            const response = await fetch('/api/generate.php?type=images', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = `/api/download.php?file=${result.filename}`;
                showToast('PDF generated successfully!');
                imageFiles = [];
                updateImagesList();
            } else {
                showToast(result.message || 'Failed to generate PDF', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
            console.error(error);
        }
    });
    
    // Form to PDF submission
    document.getElementById('formToPdfForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {};
        document.querySelectorAll('.form-field-row').forEach(row => {
            const key = row.querySelector('.field-key').value;
            const value = row.querySelector('.field-value').value;
            if (key && value) {
                formData[key] = value;
            }
        });
        
        if (Object.keys(formData).length === 0) {
            showToast('Please fill in at least one field', 'error');
            return;
        }
        
        const data = {
            template: document.querySelector('select[name="template"]').value,
            formData: formData
        };
        
        try {
            const response = await fetch('/api/generate.php?type=form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = `/api/download.php?file=${result.filename}`;
                showToast('PDF generated successfully!');
            } else {
                showToast(result.message || 'Failed to generate PDF', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
            console.error(error);
        }
    });
    
    // Invoice form submission
    document.getElementById('invoiceForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const items = [];
        document.querySelectorAll('.invoice-item').forEach(item => {
            const description = item.querySelector('.item-desc').value;
            const quantity = parseFloat(item.querySelector('.item-qty').value) || 0;
            const price = parseFloat(item.querySelector('.item-price').value) || 0;
            
            if (description) {
                items.push({ description, quantity, price });
            }
        });
        
        if (items.length === 0) {
            showToast('Please add at least one item', 'error');
            return;
        }
        
        const data = {
            invoiceNumber: document.querySelector('input[name="invoiceNumber"]').value,
            date: document.querySelector('input[name="date"]').value,
            dueDate: document.querySelector('input[name="dueDate"]').value,
            from: {
                name: document.querySelector('input[name="fromName"]').value,
                address: document.querySelector('input[name="fromAddress"]').value,
                email: document.querySelector('input[name="fromEmail"]').value
            },
            to: {
                name: document.querySelector('input[name="toName"]').value,
                address: document.querySelector('input[name="toAddress"]').value,
                email: document.querySelector('input[name="toEmail"]').value
            },
            items: items,
            discount: parseFloat(document.querySelector('input[name="discount"]').value) || 0,
            tax: parseFloat(document.querySelector('input[name="tax"]').value) || 0,
            notes: document.querySelector('textarea[name="notes"]').value
        };
        
        try {
            const response = await fetch('/api/generate.php?type=invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = `/api/download.php?file=${result.filename}`;
                showToast('Invoice generated successfully!');
            } else {
                showToast(result.message || 'Failed to generate invoice', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
            console.error(error);
        }
    });
    
    // PDF merge dropzone
    const pdfDropzone = document.getElementById('pdfDropzone');
    const pdfInput = pdfDropzone.querySelector('input[type="file"]');
    const pdfsList = document.getElementById('pdfsList');
    let pdfFiles = [];
    
    pdfDropzone.addEventListener('click', () => pdfInput.click());
    
    pdfDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        pdfDropzone.classList.add('dragover');
    });
    
    pdfDropzone.addEventListener('dragleave', () => {
        pdfDropzone.classList.remove('dragover');
    });
    
    pdfDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        pdfDropzone.classList.remove('dragover');
        handlePdfFiles(e.dataTransfer.files);
    });
    
    pdfInput.addEventListener('change', (e) => {
        handlePdfFiles(e.target.files);
    });
    
    function handlePdfFiles(files) {
        for (let file of files) {
            if (file.type === 'application/pdf') {
                pdfFiles.push(file);
            }
        }
        updatePdfsList();
    }
    
    function updatePdfsList() {
        if (pdfFiles.length > 0) {
            pdfsList.classList.remove('hidden');
            pdfsList.innerHTML = '<h3 class="font-semibold mb-2">PDF Files (' + pdfFiles.length + ') - Will be merged in order shown</h3>';
            
            pdfFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
                item.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <span class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">${index + 1}</span>
                        <i class="fas fa-file-pdf text-red-600"></i>
                        <span>${file.name}</span>
                        <span class="text-sm text-gray-500">(${(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <div class="flex space-x-2">
                        ${index > 0 ? `<button type="button" onclick="movePdf(${index}, -1)" class="text-gray-600 hover:text-gray-800"><i class="fas fa-arrow-up"></i></button>` : ''}
                        ${index < pdfFiles.length - 1 ? `<button type="button" onclick="movePdf(${index}, 1)" class="text-gray-600 hover:text-gray-800"><i class="fas fa-arrow-down"></i></button>` : ''}
                        <button type="button" onclick="removePdf(${index})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                pdfsList.appendChild(item);
            });
            
            document.querySelector('#mergeForm button[type="submit"]').disabled = pdfFiles.length < 2;
        } else {
            pdfsList.classList.add('hidden');
            document.querySelector('#mergeForm button[type="submit"]').disabled = true;
        }
    }
    
    window.removePdf = function(index) {
        pdfFiles.splice(index, 1);
        updatePdfsList();
    };
    
    window.movePdf = function(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < pdfFiles.length) {
            [pdfFiles[index], pdfFiles[newIndex]] = [pdfFiles[newIndex], pdfFiles[index]];
            updatePdfsList();
        }
    };
    
    // Merge form submission
    document.getElementById('mergeForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (pdfFiles.length < 2) {
            showToast('Please select at least 2 PDF files', 'error');
            return;
        }
        
        const formData = new FormData();
        pdfFiles.forEach(file => {
            formData.append('pdfs[]', file);
        });
        
        try {
            const response = await fetch('/api/generate.php?type=merge', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = `/api/download.php?file=${result.filename}`;
                showToast('PDFs merged successfully!');
                pdfFiles = [];
                updatePdfsList();
            } else {
                showToast(result.message || 'Failed to merge PDFs', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
            console.error(error);
        }
    });
    
    // Invoice calculations on input
    document.querySelectorAll('input[name="discount"], input[name="tax"]').forEach(input => {
        input.addEventListener('input', calculateInvoiceTotals);
    });
    
    // Set default dates
    document.querySelector('input[name="date"]').value = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.querySelector('input[name="dueDate"]').value = dueDate.toISOString().split('T')[0];
    
    // Show home tab by default
    showTab('home');
});