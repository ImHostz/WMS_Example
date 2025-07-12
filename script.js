// Global variables
let currentUser = null;
let currentRole = null;
let products = [];
let activities = [];

// Demo users
const users = {
    'admin': { password: 'admin123', role: 'admin' },
    'worker': { password: 'worker123', role: 'worker' },
    'supervisor': { password: 'sup123', role: 'supervisor' }
};

// Sample data for demonstration
const sampleProducts = [
    {
        sku: 'LAP001',
        name: 'Dell Latitude Laptop',
        category: 'Electronics',
        quantity: 25,
        price: 899.99,
        minStock: 10,
        description: 'Business laptop with Intel i7 processor'
    },
    {
        sku: 'PHN001',
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        quantity: 8,
        price: 999.99,
        minStock: 15,
        description: 'Latest iPhone with advanced camera system'
    },
    {
        sku: 'TSH001',
        name: 'Cotton T-Shirt',
        category: 'Clothing',
        quantity: 150,
        price: 19.99,
        minStock: 50,
        description: 'Comfortable cotton t-shirt in various sizes'
    },
    {
        sku: 'SHO001',
        name: 'Nike Running Shoes',
        category: 'Sports',
        quantity: 5,
        price: 129.99,
        minStock: 20,
        description: 'Professional running shoes with cushioning'
    },
    {
        sku: 'BOK001',
        name: 'JavaScript Programming',
        category: 'Books',
        quantity: 12,
        price: 49.99,
        minStock: 8,
        description: 'Comprehensive guide to JavaScript programming'
    },
    {
        sku: 'CAR001',
        name: 'Car Air Freshener',
        category: 'Automotive',
        quantity: 75,
        price: 8.99,
        minStock: 30,
        description: 'Long-lasting car air freshener'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show login modal
    showLoginModal();
}

function loadData() {
    // Load products from localStorage or use sample data
    const savedProducts = localStorage.getItem('warehouse_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [...sampleProducts];
        localStorage.setItem('warehouse_products', JSON.stringify(products));
    }
    
    // Load activities from localStorage
    const savedActivities = localStorage.getItem('warehouse_activities');
    if (savedActivities) {
        activities = JSON.parse(savedActivities);
    } else {
        activities = [];
        localStorage.setItem('warehouse_activities', JSON.stringify(activities));
    }
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });
    
    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    
    // Edit product form
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);
    
    // Cancel edit button
    document.getElementById('cancelEdit').addEventListener('click', hideEditModal);
    
    // Search and filter
    document.getElementById('searchInventory').addEventListener('input', filterInventory);
    document.getElementById('categoryFilter').addEventListener('change', filterInventory);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    
    // Barcode scanner
    document.getElementById('scanBtn').addEventListener('click', handleBarcodeScan);
    document.getElementById('barcodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleBarcodeScan();
        }
    });
}

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (users[username] && users[username].password === password && users[username].role === role) {
        currentUser = username;
        currentRole = role;
        
        // Update UI
        document.getElementById('currentUser').textContent = `Welcome, ${username}`;
        document.getElementById('currentRole').textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        hideLoginModal();
        updateDashboard();
        renderInventoryTable();
        updateReports();
        
        // Add login activity
        addActivity(`${username} logged in as ${role}`);
        
        showMessage('Login successful!', 'success');
    } else {
        showMessage('Invalid credentials. Please try again.', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    currentRole = null;
    showLoginModal();
    showMessage('Logged out successfully.', 'success');
}

function switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    // Update content based on section
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'inventory':
            renderInventoryTable();
            break;
        case 'reports':
            updateReports();
            break;
    }
}

function updateDashboard() {
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const categoryCount = new Set(products.map(p => p.category)).size;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('categoryCount').textContent = categoryCount;
    
    // Update recent activity
    updateRecentActivity();
    
    // Update charts
    updateStockChart();
}

function updateRecentActivity() {
    const recentActivity = document.getElementById('recentActivity');
    const recentActivities = activities.slice(-10).reverse();
    
    recentActivity.innerHTML = recentActivities.length > 0 
        ? recentActivities.map(activity => `
            <div class="activity-item">
                <span>${activity.message}</span>
                <span class="activity-time">${formatTime(activity.timestamp)}</span>
            </div>
        `).join('')
        : '<div class="activity-item">No recent activity</div>';
}

function updateStockChart() {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;
    
    // Create simple bar chart using CSS
    const chartData = products.slice(0, 5).map(p => ({
        name: p.name,
        quantity: p.quantity
    }));
    
    // For now, we'll create a simple visualization
    // In a real app, you'd use Chart.js or similar
    ctx.style.height = '200px';
    ctx.style.background = '#f8f9fa';
    ctx.style.borderRadius = '5px';
    ctx.style.display = 'flex';
    ctx.style.alignItems = 'end';
    ctx.style.justifyContent = 'space-around';
    ctx.style.padding = '1rem';
    
    const maxQuantity = Math.max(...chartData.map(d => d.quantity));
    
    ctx.innerHTML = chartData.map(item => `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="
                width: 30px; 
                height: ${(item.quantity / maxQuantity) * 150}px; 
                background: #667eea; 
                border-radius: 3px;
                margin-bottom: 0.5rem;
            "></div>
            <div style="font-size: 0.8rem; text-align: center; max-width: 60px;">${item.name}</div>
        </div>
    `).join('');
}

function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Update category filter options
    const categories = ['', ...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat || 'All Categories'}</option>`
    ).join('');
    
    // Render table
    tbody.innerHTML = products.map(product => {
        const status = getStockStatus(product);
        return `
            <tr>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td><span class="status-badge status-${status}">${status.replace('-', ' ')}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="editProduct('${product.sku}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteProduct('${product.sku}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getStockStatus(product) {
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= product.minStock) return 'low-stock';
    return 'in-stock';
}

function filterInventory() {
    const searchTerm = document.getElementById('searchInventory').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const tbody = document.getElementById('inventoryTableBody');
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.sku.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    tbody.innerHTML = filteredProducts.map(product => {
        const status = getStockStatus(product);
        return `
            <tr>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td><span class="status-badge status-${status}">${status.replace('-', ' ')}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="editProduct('${product.sku}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteProduct('${product.sku}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const product = {
        sku: formData.get('sku') || document.getElementById('sku').value,
        name: formData.get('productName') || document.getElementById('productName').value,
        category: formData.get('category') || document.getElementById('category').value,
        quantity: parseInt(formData.get('quantity') || document.getElementById('quantity').value),
        price: parseFloat(formData.get('price') || document.getElementById('price').value),
        minStock: parseInt(formData.get('minStock') || document.getElementById('minStock').value),
        description: formData.get('description') || document.getElementById('description').value
    };
    
    // Validate SKU uniqueness
    if (products.find(p => p.sku === product.sku)) {
        showMessage('SKU already exists. Please use a unique SKU.', 'error');
        return;
    }
    
    products.push(product);
    saveData();
    
    // Add activity
    addActivity(`${currentUser} added product: ${product.name} (${product.sku})`);
    
    // Update UI
    updateDashboard();
    renderInventoryTable();
    updateReports();
    
    // Reset form
    e.target.reset();
    
    showMessage('Product added successfully!', 'success');
}

function editProduct(sku) {
    const product = products.find(p => p.sku === sku);
    if (!product) return;
    
    // Populate edit form
    document.getElementById('editSku').value = product.sku;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editQuantity').value = product.quantity;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editMinStock').value = product.minStock;
    document.getElementById('editDescription').value = product.description;
    
    // Show modal
    document.getElementById('editModal').classList.remove('hidden');
}

function hideEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function handleEditProduct(e) {
    e.preventDefault();
    
    const sku = document.getElementById('editSku').value;
    const productIndex = products.findIndex(p => p.sku === sku);
    
    if (productIndex === -1) {
        showMessage('Product not found.', 'error');
        return;
    }
    
    const oldProduct = products[productIndex];
    const updatedProduct = {
        ...oldProduct,
        name: document.getElementById('editProductName').value,
        category: document.getElementById('editCategory').value,
        quantity: parseInt(document.getElementById('editQuantity').value),
        price: parseFloat(document.getElementById('editPrice').value),
        minStock: parseInt(document.getElementById('editMinStock').value),
        description: document.getElementById('editDescription').value
    };
    
    products[productIndex] = updatedProduct;
    saveData();
    
    // Add activity
    addActivity(`${currentUser} updated product: ${updatedProduct.name} (${sku})`);
    
    // Update UI
    updateDashboard();
    renderInventoryTable();
    updateReports();
    
    hideEditModal();
    showMessage('Product updated successfully!', 'success');
}

function deleteProduct(sku) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const productIndex = products.findIndex(p => p.sku === sku);
    if (productIndex === -1) return;
    
    const product = products[productIndex];
    products.splice(productIndex, 1);
    saveData();
    
    // Add activity
    addActivity(`${currentUser} deleted product: ${product.name} (${sku})`);
    
    // Update UI
    updateDashboard();
    renderInventoryTable();
    updateReports();
    
    showMessage('Product deleted successfully!', 'success');
}

function handleBarcodeScan() {
    const sku = document.getElementById('barcodeInput').value.trim();
    if (!sku) {
        showMessage('Please enter a SKU to scan.', 'warning');
        return;
    }
    
    const product = products.find(p => p.sku === sku);
    const resultDiv = document.getElementById('scanResult');
    
    if (product) {
        resultDiv.innerHTML = `
            <h3>Product Found</h3>
            <p><strong>SKU:</strong> ${product.sku}</p>
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Quantity:</strong> ${product.quantity}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${getStockStatus(product)}">${getStockStatus(product).replace('-', ' ')}</span></p>
            <p><strong>Description:</strong> ${product.description}</p>
        `;
        resultDiv.classList.remove('hidden');
        
        // Add activity
        addActivity(`${currentUser} scanned product: ${product.name} (${sku})`);
    } else {
        resultDiv.innerHTML = `
            <h3>Product Not Found</h3>
            <p>No product found with SKU: ${sku}</p>
        `;
        resultDiv.classList.remove('hidden');
    }
    
    // Clear input
    document.getElementById('barcodeInput').value = '';
}

function updateReports() {
    // Low stock report
    const lowStockProducts = products.filter(p => p.quantity <= p.minStock);
    const lowStockReport = document.getElementById('lowStockReport');
    
    lowStockReport.innerHTML = lowStockProducts.length > 0 
        ? lowStockProducts.map(product => `
            <div class="report-item">
                <span>${product.name} (${product.sku})</span>
                <span>${product.quantity} / ${product.minStock}</span>
            </div>
        `).join('')
        : '<div class="report-item">No low stock items</div>';
    
    // Category distribution chart
    updateCategoryChart();
    
    // Value by category chart
    updateValueChart();
    
    // Stock movement
    updateStockMovement();
}

function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const categoryData = {};
    products.forEach(product => {
        categoryData[product.category] = (categoryData[product.category] || 0) + 1;
    });
    
    // Simple visualization
    ctx.style.height = '200px';
    ctx.style.background = '#f8f9fa';
    ctx.style.borderRadius = '5px';
    ctx.style.padding = '1rem';
    
    ctx.innerHTML = Object.entries(categoryData).map(([category, count]) => `
        <div style="margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span>${category}</span>
                <span>${count}</span>
            </div>
            <div style="
                width: 100%; 
                height: 20px; 
                background: #e9ecef; 
                border-radius: 10px; 
                overflow: hidden;
            ">
                <div style="
                    width: ${(count / Math.max(...Object.values(categoryData))) * 100}%; 
                    height: 100%; 
                    background: #667eea;
                "></div>
            </div>
        </div>
    `).join('');
}

function updateValueChart() {
    const ctx = document.getElementById('valueChart');
    if (!ctx) return;
    
    const valueData = {};
    products.forEach(product => {
        valueData[product.category] = (valueData[product.category] || 0) + (product.quantity * product.price);
    });
    
    // Simple visualization
    ctx.style.height = '200px';
    ctx.style.background = '#f8f9fa';
    ctx.style.borderRadius = '5px';
    ctx.style.padding = '1rem';
    
    ctx.innerHTML = Object.entries(valueData).map(([category, value]) => `
        <div style="margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span>${category}</span>
                <span>$${value.toFixed(2)}</span>
            </div>
            <div style="
                width: 100%; 
                height: 20px; 
                background: #e9ecef; 
                border-radius: 10px; 
                overflow: hidden;
            ">
                <div style="
                    width: ${(value / Math.max(...Object.values(valueData))) * 100}%; 
                    height: 100%; 
                    background: #28a745;
                "></div>
            </div>
        </div>
    `).join('');
}

function updateStockMovement() {
    const stockMovement = document.getElementById('stockMovement');
    const recentActivities = activities
        .filter(activity => activity.message.includes('added') || activity.message.includes('updated') || activity.message.includes('deleted'))
        .slice(-10)
        .reverse();
    
    stockMovement.innerHTML = recentActivities.length > 0 
        ? recentActivities.map(activity => `
            <div class="report-item">
                <span>${activity.message}</span>
                <span class="activity-time">${formatTime(activity.timestamp)}</span>
            </div>
        `).join('')
        : '<div class="report-item">No recent stock movements</div>';
}

function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(products.map(product => ({
        SKU: product.sku,
        'Product Name': product.name,
        Category: product.category,
        Quantity: product.quantity,
        Price: product.price,
        'Min Stock': product.minStock,
        'Total Value': product.quantity * product.price,
        Description: product.description
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `warehouse_inventory_${date}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
    
    // Add activity
    addActivity(`${currentUser} exported inventory to Excel`);
    
    showMessage('Inventory exported to Excel successfully!', 'success');
}

function addActivity(message) {
    const activity = {
        message,
        timestamp: new Date().toISOString()
    };
    
    activities.push(activity);
    
    // Keep only last 100 activities
    if (activities.length > 100) {
        activities = activities.slice(-100);
    }
    
    saveData();
}

function saveData() {
    localStorage.setItem('warehouse_products', JSON.stringify(products));
    localStorage.setItem('warehouse_activities', JSON.stringify(activities));
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Make functions globally available for onclick handlers
window.editProduct = editProduct;
window.deleteProduct = deleteProduct; 