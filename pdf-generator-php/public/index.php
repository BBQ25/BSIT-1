<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Creator Generator - PHP Edition</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .tab-active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .dropzone {
            transition: all 0.3s ease;
        }
        .dropzone.dragover {
            background-color: #f0f9ff;
            border-color: #3b82f6;
        }
    </style>
</head>
<body class="min-h-screen gradient-bg">
    <!-- Header -->
    <header class="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-file-pdf text-3xl text-purple-600"></i>
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        PDF Creator Pro
                    </h1>
                </div>
                <nav class="hidden md:flex space-x-2">
                    <button onclick="showTab('home')" class="tab-btn px-4 py-2 rounded-lg hover:bg-gray-100 transition" data-tab="home">
                        <i class="fas fa-home mr-2"></i>Home
                    </button>
                    <button onclick="showTab('text')" class="tab-btn px-4 py-2 rounded-lg hover:bg-gray-100 transition" data-tab="text">
                        <i class="fas fa-file-alt mr-2"></i>Text to PDF
                    </button>
                    <button onclick="showTab('html')" class="tab-btn px-4 py-2 rounded-lg hover:bg-gray-100 transition" data-tab="html">
                        <i class="fas fa-code mr-2"></i>HTML to PDF
                    </button>
                    <button onclick="showTab('images')" class="tab-btn px-4 py-2 rounded-lg hover:bg-gray-100 transition" data-tab="images">
                        <i class="fas fa-images mr-2"></i>Images to PDF
                    </button>
                    <button onclick="showTab('form')" class="tab-btn px-4 py-2 rounded-lg hover:bg-gray-100 transition" data-tab="form">
                        <i class="fas fa-wpforms mr-2"></i>Form to PDF
                    </button>
                    <button onclick="showTab('invoice')" class="tab-btn px-4 py-2 rounded-lg hover:bg-gray-100 transition" data-tab="invoice">
                        <i class="fas fa-file-invoice-dollar mr-2"></i>Invoice
                    </button>
                    <button onclick="showTab('merge')" class="tab-btn px-4 py-2 rounded-lg hover:bg-gray-100 transition" data-tab="merge">
                        <i class="fas fa-layer-group mr-2"></i>Merge PDFs
                    </button>
                </nav>
                <!-- Mobile menu button -->
                <button onclick="toggleMobileMenu()" class="md:hidden text-gray-600">
                    <i class="fas fa-bars text-2xl"></i>
                </button>
            </div>
            <!-- Mobile menu -->
            <nav id="mobileMenu" class="hidden md:hidden mt-4 space-y-2">
                <button onclick="showTab('home')" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                    <i class="fas fa-home mr-2"></i>Home
                </button>
                <button onclick="showTab('text')" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                    <i class="fas fa-file-alt mr-2"></i>Text to PDF
                </button>
                <button onclick="showTab('html')" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                    <i class="fas fa-code mr-2"></i>HTML to PDF
                </button>
                <button onclick="showTab('images')" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                    <i class="fas fa-images mr-2"></i>Images to PDF
                </button>
                <button onclick="showTab('form')" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                    <i class="fas fa-wpforms mr-2"></i>Form to PDF
                </button>
                <button onclick="showTab('invoice')" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                    <i class="fas fa-file-invoice-dollar mr-2"></i>Invoice
                </button>
                <button onclick="showTab('merge')" class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                    <i class="fas fa-layer-group mr-2"></i>Merge PDFs
                </button>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Home Tab -->
        <div id="home" class="tab-content">
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 class="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Create Professional PDFs in Seconds
                </h2>
                <p class="text-center text-gray-600 text-lg mb-8">
                    Transform your content into high-quality PDF documents with our powerful suite of tools
                </p>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div class="flex items-center space-x-2 text-green-600">
                        <i class="fas fa-check-circle"></i>
                        <span>No registration required</span>
                    </div>
                    <div class="flex items-center space-x-2 text-green-600">
                        <i class="fas fa-check-circle"></i>
                        <span>Fast processing</span>
                    </div>
                    <div class="flex items-center space-x-2 text-green-600">
                        <i class="fas fa-check-circle"></i>
                        <span>Secure & private</span>
                    </div>
                    <div class="flex items-center space-x-2 text-green-600">
                        <i class="fas fa-check-circle"></i>
                        <span>Multiple formats</span>
                    </div>
                    <div class="flex items-center space-x-2 text-green-600">
                        <i class="fas fa-check-circle"></i>
                        <span>Professional templates</span>
                    </div>
                    <div class="flex items-center space-x-2 text-green-600">
                        <i class="fas fa-check-circle"></i>
                        <span>Free to use</span>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onclick="showTab('text')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                    <div class="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-file-alt text-2xl text-indigo-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Text to PDF</h3>
                    <p class="text-gray-600">Convert plain text into professionally formatted PDF documents</p>
                </div>
                <div onclick="showTab('html')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                    <div class="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-code text-2xl text-red-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">HTML to PDF</h3>
                    <p class="text-gray-600">Transform HTML content with CSS styling into PDFs</p>
                </div>
                <div onclick="showTab('images')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                    <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-images text-2xl text-green-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Images to PDF</h3>
                    <p class="text-gray-600">Combine multiple images into a single PDF document</p>
                </div>
                <div onclick="showTab('form')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                    <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-wpforms text-2xl text-orange-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Form to PDF</h3>
                    <p class="text-gray-600">Generate PDFs from form data with custom templates</p>
                </div>
                <div onclick="showTab('invoice')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                    <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-file-invoice-dollar text-2xl text-purple-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Invoice Generator</h3>
                    <p class="text-gray-600">Create professional invoices with automatic calculations</p>
                </div>
                <div onclick="showTab('merge')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                    <div class="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-layer-group text-2xl text-teal-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Merge PDFs</h3>
                    <p class="text-gray-600">Combine multiple PDF files into one document</p>
                </div>
            </div>
        </div>

        <!-- Text to PDF Tab -->
        <div id="text" class="tab-content hidden">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-file-alt text-indigo-600 mr-2"></i>Text to PDF
                </h2>
                <p class="text-gray-600 mb-6">Convert your text content into a professionally formatted PDF document</p>
                
                <form id="textForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                        <input type="text" name="title" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter document title">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                        <textarea name="content" rows="10" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter your text content here..." required></textarea>
                    </div>
                    
                    <div class="grid md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                            <input type="number" name="fontSize" value="12" min="8" max="72" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                            <select name="fontFamily" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="helvetica">Helvetica</option>
                                <option value="times">Times Roman</option>
                                <option value="courier">Courier</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                            <select name="pageSize" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="A4">A4</option>
                                <option value="A3">A3</option>
                                <option value="LETTER">Letter</option>
                                <option value="LEGAL">Legal</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                            <input type="color" name="textColor" value="#000000" class="w-full h-10 border border-gray-300 rounded-lg cursor-pointer">
                        </div>
                    </div>
                    
                    <button type="submit" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition">
                        <i class="fas fa-download mr-2"></i>Generate PDF
                    </button>
                </form>
            </div>
        </div>

        <!-- HTML to PDF Tab -->
        <div id="html" class="tab-content hidden">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-code text-red-600 mr-2"></i>HTML to PDF
                </h2>
                <p class="text-gray-600 mb-6">Convert HTML content with CSS styling into PDF documents</p>
                
                <form id="htmlForm" class="space-y-4">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-medium text-gray-700">HTML Content *</label>
                        <button type="button" onclick="loadSampleHTML()" class="text-indigo-600 hover:text-indigo-800 text-sm">
                            Load Sample HTML
                        </button>
                    </div>
                    <textarea name="html" rows="15" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm" placeholder="Enter your HTML content here..." required></textarea>
                    
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                            <select name="pageSize" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="A4">A4</option>
                                <option value="A3">A3</option>
                                <option value="letter">Letter</option>
                                <option value="legal">Legal</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                            <select name="orientation" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" id="previewHTML" class="rounded">
                        <label for="previewHTML" class="text-sm text-gray-700">Preview HTML before conversion</label>
                    </div>
                    
                    <div id="htmlPreview" class="hidden border border-gray-300 rounded-lg p-4 bg-gray-50"></div>
                    
                    <button type="submit" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition">
                        <i class="fas fa-download mr-2"></i>Generate PDF
                    </button>
                </form>
            </div>
        </div>

        <!-- Images to PDF Tab -->
        <div id="images" class="tab-content hidden">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-images text-green-600 mr-2"></i>Images to PDF
                </h2>
                <p class="text-gray-600 mb-6">Combine multiple images into a single PDF document</p>
                
                <form id="imagesForm" class="space-y-4">
                    <div id="imageDropzone" class="dropzone border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition">
                        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600 mb-2">Drag & drop images here, or click to select</p>
                        <p class="text-sm text-gray-500">Supports: PNG, JPG, JPEG, GIF, BMP, WebP</p>
                        <input type="file" name="images[]" multiple accept="image/*" class="hidden">
                    </div>
                    
                    <div id="imagesList" class="hidden space-y-2"></div>
                    
                    <button type="submit" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition" disabled>
                        <i class="fas fa-download mr-2"></i>Generate PDF
                    </button>
                </form>
            </div>
        </div>

        <!-- Form to PDF Tab -->
        <div id="form" class="tab-content hidden">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-wpforms text-orange-600 mr-2"></i>Form to PDF
                </h2>
                <p class="text-gray-600 mb-6">Generate PDFs from form data with custom templates</p>
                
                <form id="formToPdfForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Template</label>
                        <select name="template" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option>Application Form</option>
                            <option>Registration Form</option>
                            <option>Contact Form</option>
                            <option>Survey Form</option>
                            <option>Custom Form</option>
                        </select>
                    </div>
                    
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-medium text-gray-700">Form Fields</label>
                        <button type="button" onclick="loadSampleFormData()" class="text-indigo-600 hover:text-indigo-800 text-sm">
                            Load Sample Data
                        </button>
                    </div>
                    
                    <div id="formFields" class="space-y-2">
                        <div class="form-field-row flex gap-2">
                            <input type="text" placeholder="Field name" class="field-key flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <input type="text" placeholder="Field value" class="field-value flex-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <button type="button" onclick="removeFormField(this)" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <button type="button" onclick="addFormField()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        <i class="fas fa-plus mr-2"></i>Add Field
                    </button>
                    
                    <button type="submit" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition">
                        <i class="fas fa-download mr-2"></i>Generate PDF
                    </button>
                </form>
            </div>
        </div>

        <!-- Invoice Tab -->
        <div id="invoice" class="tab-content hidden">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-file-invoice-dollar text-purple-600 mr-2"></i>Invoice Generator
                </h2>
                <p class="text-gray-600 mb-6">Create professional invoices with automatic calculations</p>
                
                <form id="invoiceForm" class="space-y-6">
                    <div class="flex justify-end">
                        <button type="button" onclick="loadSampleInvoice()" class="text-indigo-600 hover:text-indigo-800 text-sm">
                            Load Sample Invoice
                        </button>
                    </div>
                    
                    <!-- Invoice Details -->
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold mb-3">Invoice Details</h3>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                                <input type="text" name="invoiceNumber" value="INV-001" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" name="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input type="date" name="dueDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                        </div>
                    </div>
                    
                    <!-- From and To -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold mb-3">From</h3>
                            <input type="text" name="fromName" placeholder="Company Name" class="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <input type="text" name="fromAddress" placeholder="Address" class="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <input type="email" name="fromEmail" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold mb-3">To</h3>
                            <input type="text" name="toName" placeholder="Client Name" class="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <input type="text" name="toAddress" placeholder="Address" class="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <input type="email" name="toEmail" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        </div>
                    </div>
                    
                    <!-- Items -->
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold mb-3">Items</h3>
                        <div class="hidden md:grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-700">
                            <div class="col-span-5">Description</div>
                            <div class="col-span-2 text-center">Quantity</div>
                            <div class="col-span-2 text-right">Price</div>
                            <div class="col-span-2 text-right">Total</div>
                            <div class="col-span-1"></div>
                        </div>
                        <div id="invoiceItems" class="space-y-2">
                            <div class="invoice-item grid grid-cols-12 gap-2">
                                <input type="text" placeholder="Item description" class="item-desc col-span-5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <input type="number" value="1" min="1" class="item-qty col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center">
                                <input type="number" value="0" min="0" step="0.01" class="item-price col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right">
                                <div class="item-total col-span-2 px-3 py-2 text-right">$0.00</div>
                                <button type="button" onclick="removeInvoiceItem(this)" class="col-span-1 px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" onclick="addInvoiceItem()" class="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            <i class="fas fa-plus mr-2"></i>Add Item
                        </button>
                    </div>
                    
                    <!-- Totals -->
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="max-w-sm ml-auto space-y-2">
                            <div class="flex justify-between">
                                <span>Subtotal:</span>
                                <span id="subtotal">$0.00</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Discount (%):</span>
                                <input type="number" name="discount" value="0" min="0" max="100" class="w-20 px-2 py-1 border border-gray-300 rounded text-right">
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Tax (%):</span>
                                <input type="number" name="tax" value="0" min="0" max="100" class="w-20 px-2 py-1 border border-gray-300 rounded text-right">
                            </div>
                            <div class="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span id="total">$0.00</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea name="notes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Additional notes or payment instructions..."></textarea>
                    </div>
                    
                    <button type="submit" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition">
                        <i class="fas fa-download mr-2"></i>Generate Invoice
                    </button>
                </form>
            </div>
        </div>

        <!-- Merge PDFs Tab -->
        <div id="merge" class="tab-content hidden">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-layer-group text-teal-600 mr-2"></i>Merge PDFs
                </h2>
                <p class="text-gray-600 mb-6">Combine multiple PDF files into one document</p>
                
                <form id="mergeForm" class="space-y-4">
                    <div id="pdfDropzone" class="dropzone border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition">
                        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600 mb-2">Drag & drop PDF files here, or click to select</p>
                        <p class="text-sm text-gray-500">Only PDF files are accepted (minimum 2 files)</p>
                        <input type="file" name="pdfs[]" multiple accept="application/pdf" class="hidden">
                    </div>
                    
                    <div id="pdfsList" class="hidden space-y-2"></div>
                    
                    <button type="submit" class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition" disabled>
                        <i class="fas fa-download mr-2"></i>Merge PDFs
                    </button>
                </form>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white/95 backdrop-blur-md mt-16 py-6">
        <div class="container mx-auto px-4 text-center text-gray-600">
            <p>© 2024 PDF Creator Pro. Create professional PDFs with ease.</p>
        </div>
    </footer>

    <!-- Toast Container -->
    <div id="toastContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>

    <!-- JavaScript -->
    <script src="js/app.js"></script>
</body>
</html>