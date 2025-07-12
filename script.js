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

// --- Permissions System ---
const DEFAULT_PERMISSIONS = {
    admin: {
        view: true,
        add: true,
        edit: true,
        delete: true,
        import: true,
        export: true,
        reports: true,
        barcode: true
    },
    supervisor: {
        view: true,
        add: true,
        edit: true,
        delete: false,
        import: true,
        export: true,
        reports: true,
        barcode: true
    },
    worker: {
        view: true,
        add: false,
        edit: false,
        delete: false,
        import: false,
        export: false,
        reports: true,
        barcode: true
    }
};

function getPermissions() {
    return JSON.parse(localStorage.getItem('wms_permissions')) || DEFAULT_PERMISSIONS;
}

function setPermissions(perms) {
    localStorage.setItem('wms_permissions', JSON.stringify(perms));
}

function resetPermissions() {
    setPermissions(DEFAULT_PERMISSIONS);
    loadPermissionsUI();
    showMessage('Permissions reset to default.', 'success');
}

function loadPermissionsUI() {
    const perms = getPermissions();
    
    // Get all existing permissions from the current state
    const allPermissions = new Set();
    Object.values(perms).forEach(rolePerms => {
        Object.keys(rolePerms).forEach(perm => allPermissions.add(perm));
    });
    
    // Update existing checkboxes
    allPermissions.forEach(perm => {
        const supervisorCheckbox = document.getElementById(`supervisor-${perm}`);
        const workerCheckbox = document.getElementById(`worker-${perm}`);
        
        if (supervisorCheckbox) {
            supervisorCheckbox.checked = !!perms.supervisor[perm];
        }
        if (workerCheckbox) {
            workerCheckbox.checked = !!perms.worker[perm];
        }
    });
    
    // Update role cards
    updateRoleCards();
}

function savePermissionsFromUI() {
    const perms = getPermissions();
    
    // Get all existing permissions from the current state
    const allPermissions = new Set();
    Object.values(perms).forEach(rolePerms => {
        Object.keys(rolePerms).forEach(perm => allPermissions.add(perm));
    });
    
    // Update permissions from checkboxes
    allPermissions.forEach(perm => {
        const supervisorCheckbox = document.getElementById(`supervisor-${perm}`);
        const workerCheckbox = document.getElementById(`worker-${perm}`);
        
        if (supervisorCheckbox) {
            perms.supervisor[perm] = supervisorCheckbox.checked;
        }
        if (workerCheckbox) {
            perms.worker[perm] = workerCheckbox.checked;
        }
    });
    
    setPermissions(perms);
    
    // Update role cards dynamically
    updateRoleCards();
    
    // Add activity
    addActivity(`${currentUser} updated user permissions`);
    
    showMessage('Permissions saved successfully!', 'success');
}

function updateRoleCards() {
    const perms = getPermissions();
    
    // Update Supervisor card
    updateRoleCard('supervisor', perms.supervisor);
    
    // Update Worker card
    updateRoleCard('worker', perms.worker);
}

function updateRoleCard(role, permissions) {
    const card = document.querySelector(`.permission-card[data-role="${role}"]`);
    if (!card) return;
    
    const permissionList = card.querySelector('.permission-list');
    if (!permissionList) return;
    
    // Clear existing permissions
    permissionList.innerHTML = '';
    
    // Define permission labels
    const permissionLabels = {
        view: 'View all inventory',
        add: 'Add/Edit products',
        edit: 'Edit products',
        delete: 'Delete products',
        import: 'Import/Export Excel files',
        export: 'Export Excel files',
        reports: 'View all reports',
        barcode: 'Access barcode scanner'
    };
    
    // Add each permission with appropriate icon
    Object.entries(permissions).forEach(([perm, enabled]) => {
        const permissionItem = document.createElement('div');
        permissionItem.className = 'permission-item';
        
        const icon = document.createElement('i');
        icon.className = enabled ? 'fas fa-check text-success' : 'fas fa-times text-danger';
        
        const span = document.createElement('span');
        span.textContent = permissionLabels[perm] || perm;
        
        permissionItem.appendChild(icon);
        permissionItem.appendChild(span);
        permissionList.appendChild(permissionItem);
    });
    
    // Add animation effect
    card.classList.add('updated');
    setTimeout(() => {
        card.classList.remove('updated');
    }, 500);
}

function showAddPermissionModal() {
    document.getElementById('addPermissionModal').classList.remove('hidden');
}

function hideAddPermissionModal() {
    document.getElementById('addPermissionModal').classList.add('hidden');
    document.getElementById('addPermissionForm').reset();
}

function handleAddPermission(e) {
    e.preventDefault();
    
    const permissionName = document.getElementById('newPermissionName').value.trim();
    const permissionDescription = document.getElementById('newPermissionDescription').value.trim();
    
    if (!permissionName) {
        showMessage('Permission name is required.', 'error');
        return;
    }
    
    // Get current permissions
    const perms = getPermissions();
    
    // Get default role access settings
    const supervisorDefault = document.getElementById('supervisor-default').checked;
    const workerDefault = document.getElementById('worker-default').checked;
    
    // Add new permission to all roles with default values
    perms.admin[permissionName.toLowerCase()] = true; // Admin always gets new permissions
    perms.supervisor[permissionName.toLowerCase()] = supervisorDefault;
    perms.worker[permissionName.toLowerCase()] = workerDefault;
    
    // Save updated permissions
    setPermissions(perms);
    
    // Add new permission to the permissions table
    addPermissionToTable(permissionName.toLowerCase(), permissionDescription);
    
    // Update UI
    loadPermissionsUI();
    updateRoleCards();
    
    // Add activity
    addActivity(`${currentUser} added new permission: ${permissionName}`);
    
    hideAddPermissionModal();
    showMessage(`Permission "${permissionName}" added successfully!`, 'success');
}

function addPermissionToTable(permissionName, description) {
    const tableBody = document.querySelector('.permissions-table-content tbody');
    if (!tableBody) return;
    
    // Create new row
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${description || permissionName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
        <td><input type="checkbox" checked disabled></td>
        <td><input type="checkbox" id="supervisor-${permissionName}"></td>
        <td><input type="checkbox" id="worker-${permissionName}"></td>
    `;
    
    // Add row to table
    tableBody.appendChild(newRow);
    
    // Set default values based on current permissions
    const perms = getPermissions();
    const supervisorCheckbox = newRow.querySelector(`#supervisor-${permissionName}`);
    const workerCheckbox = newRow.querySelector(`#worker-${permissionName}`);
    
    if (supervisorCheckbox) {
        supervisorCheckbox.checked = !!perms.supervisor[permissionName];
    }
    if (workerCheckbox) {
        workerCheckbox.checked = !!perms.worker[permissionName];
    }
}

// Show/hide Permissions tab for admin only
function updatePermissionsTabVisibility() {
    const tab = document.querySelector('.nav-btn[data-section="permissions"]');
    if (currentRole === 'admin') {
        tab.classList.add('show');
        tab.style.display = '';
    } else {
        tab.classList.remove('show');
        tab.style.display = 'none';
    }
}

// Enforce permissions in UI/actions
function enforcePermissions() {
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    // Inventory actions
    document.getElementById('addProductBtn').style.display = rolePerms.add ? '' : 'none';
    document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = rolePerms.edit ? '' : 'none');
    document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = rolePerms.delete ? '' : 'none');
    document.getElementById('importBtn').style.display = rolePerms.import ? '' : 'none';
    document.getElementById('exportBtn').style.display = rolePerms.export ? '' : 'none';
    // Reports
    document.querySelector('.nav-btn[data-section="reports"]').style.display = rolePerms.reports ? '' : 'none';
    // Barcode
    document.querySelector('.nav-btn[data-section="barcode"]').style.display = rolePerms.barcode ? '' : 'none';
}

// --- Permissions Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    // Permissions tab logic
    if (document.getElementById('savePermissions')) {
        document.getElementById('savePermissions').addEventListener('click', savePermissionsFromUI);
        document.getElementById('resetPermissions').addEventListener('click', resetPermissions);
        loadPermissionsUI();
    }
    
    // Add Permission functionality
    if (document.getElementById('addPermissionBtn')) {
        document.getElementById('addPermissionBtn').addEventListener('click', showAddPermissionModal);
        document.getElementById('addPermissionForm').addEventListener('submit', handleAddPermission);
        document.getElementById('closeAddPermissionModal').addEventListener('click', hideAddPermissionModal);
        document.getElementById('cancelAddPermission').addEventListener('click', hideAddPermissionModal);
    }
});

// Update permissions tab visibility and enforce permissions after login
function afterLoginPermissions() {
    updatePermissionsTabVisibility();
    enforcePermissions();
}

// Call afterLoginPermissions() after successful login
// In handleLogin, after setting currentUser/currentRole:
// afterLoginPermissions();
// Also call enforcePermissions() after any permission change or role switch


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
    
    // Add product functionality
    document.getElementById('addProductBtn').addEventListener('click', showAddProductModal);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('closeAddProductModal').addEventListener('click', hideAddProductModal);
    document.getElementById('cancelAddProduct').addEventListener('click', hideAddProductModal);
    
    // Edit product form
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);
    
    // Cancel edit button
    document.getElementById('cancelEdit').addEventListener('click', hideEditModal);
    
    // Search and filter
    document.getElementById('searchInventory').addEventListener('input', filterInventory);
    document.getElementById('categoryFilter').addEventListener('change', filterInventory);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    
    // Import functionality
    document.getElementById('importBtn').addEventListener('click', showImportModal);
    document.getElementById('importFileModal').addEventListener('change', handleFileSelect);
    document.getElementById('startImport').addEventListener('click', startImport);
    document.getElementById('cancelImport').addEventListener('click', hideImportModal);
    document.getElementById('closeImportModal').addEventListener('click', hideImportModal);
    document.getElementById('downloadTemplate').addEventListener('click', downloadTemplate);
    document.getElementById('nextStep').addEventListener('click', nextStep);
    document.getElementById('prevStep').addEventListener('click', prevStep);
    document.getElementById('importMode').addEventListener('change', updateModeDescription);
    
    // Drag and drop functionality
    setupDragAndDrop();
    
    // Step navigation
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', () => {
            const stepNumber = parseInt(step.dataset.step);
            if (stepNumber <= currentStep || (stepNumber === 2 && selectedFile)) {
                currentStep = stepNumber;
                updateSteps();
                showStep(currentStep);
            }
        });
    });
    
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
        
        // Update permissions visibility and enforce permissions
        afterLoginPermissions();
        
        showMessage('Login successful!', 'success');
    } else {
        showMessage('Invalid credentials. Please try again.', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    currentRole = null;
    
    // Hide permissions tab and reset UI
    updatePermissionsTabVisibility();
    
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
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    
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
                        ${rolePerms.edit ? `<button class="action-btn edit-btn" onclick="editProduct('${product.sku}')">
                            <i class="fas fa-edit"></i>
                        </button>` : ''}
                        ${rolePerms.delete ? `<button class="action-btn delete-btn" onclick="deleteProduct('${product.sku}')">
                            <i class="fas fa-trash"></i>
                        </button>` : ''}
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
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    
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
                        ${rolePerms.edit ? `<button class="action-btn edit-btn" onclick="editProduct('${product.sku}')">
                            <i class="fas fa-edit"></i>
                        </button>` : ''}
                        ${rolePerms.delete ? `<button class="action-btn delete-btn" onclick="deleteProduct('${product.sku}')">
                            <i class="fas fa-trash"></i>
                        </button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddProductModal() {
    // Check permissions
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    if (!rolePerms.add) {
        showMessage('You do not have permission to add products.', 'error');
        return;
    }
    
    document.getElementById('addProductModal').classList.remove('hidden');
    resetAddProductForm();
}

function hideAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
}

function resetAddProductForm() {
    document.getElementById('addProductForm').reset();
    document.getElementById('modalMinStock').value = '10';
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const sku = document.getElementById('modalSku').value.trim();
    const name = document.getElementById('modalProductName').value.trim();
    const category = document.getElementById('modalCategory').value;
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    const price = parseFloat(document.getElementById('modalPrice').value);
    const minStock = parseInt(document.getElementById('modalMinStock').value) || 10;
    const description = document.getElementById('modalDescription').value.trim();
    
    // Validate required fields
    if (!sku || !name || !category || isNaN(quantity) || isNaN(price)) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Check if SKU already exists
    if (products.some(p => p.sku === sku)) {
        showMessage('SKU already exists. Please use a unique SKU.', 'error');
        return;
    }
    
    // Validate quantity and price
    if (quantity < 0 || price < 0) {
        showMessage('Quantity and price must be non-negative.', 'error');
        return;
    }
    
    // Create new product
    const newProduct = {
        sku,
        name,
        category,
        quantity,
        price,
        minStock,
        description
    };
    
    // Add to products array
    products.push(newProduct);
    
    // Save data
    saveData();
    
    // Update UI
    updateDashboard();
    renderInventoryTable();
    updateReports();
    
    // Add activity
    addActivity(`${currentUser} added new product: ${name} (${sku})`);
    
    // Show success message
    showMessage('Product added successfully!', 'success');
    
    // Close modal and reset form
    hideAddProductModal();
    resetAddProductForm();
}

function editProduct(sku) {
    // Check permissions
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    if (!rolePerms.edit) {
        showMessage('You do not have permission to edit products.', 'error');
        return;
    }
    
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
    // Check permissions
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    if (!rolePerms.delete) {
        showMessage('You do not have permission to delete products.', 'error');
        return;
    }
    
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
    // Check permissions
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    if (!rolePerms.export) {
        showMessage('You do not have permission to export Excel files.', 'error');
        return;
    }
    
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

// Import functionality
let selectedFile = null;
let importData = [];
let currentStep = 1;

function showImportModal() {
    // Check permissions
    const perms = getPermissions();
    const rolePerms = perms[currentRole] || {};
    if (!rolePerms.import) {
        showMessage('You do not have permission to import Excel files.', 'error');
        return;
    }
    
    document.getElementById('importModal').classList.remove('hidden');
    resetImportModal();
    updateModeDescription();
}

function hideImportModal() {
    document.getElementById('importModal').classList.add('hidden');
    selectedFile = null;
    importData = [];
}

function resetImportModal() {
    currentStep = 1;
    selectedFile = null;
    importData = [];
    
    // Reset UI
    document.getElementById('startImport').disabled = true;
    document.getElementById('importProgress').classList.add('hidden');
    document.getElementById('importResults').classList.add('hidden');
    document.getElementById('importFileModal').value = '';
    document.getElementById('filePreview').classList.add('hidden');
    document.querySelector('.file-upload-area').classList.remove('dragover');
    
    // Reset steps
    updateSteps();
    showStep(1);
    
    // Reset upload placeholder
    const uploadPlaceholder = document.querySelector('.upload-placeholder p');
    uploadPlaceholder.textContent = 'Click to select Excel file or drag and drop';
}

function updateSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });
}

function showStep(stepNumber) {
    document.querySelectorAll('.import-step-content').forEach((content, index) => {
        content.classList.add('hidden');
        if (index + 1 === stepNumber) {
            content.classList.remove('hidden');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const startBtn = document.getElementById('startImport');
    
    prevBtn.disabled = stepNumber === 1;
    nextBtn.classList.toggle('hidden', stepNumber === 3);
    startBtn.classList.toggle('hidden', stepNumber !== 3);
    
    // Enable/disable start button based on file selection
    if (stepNumber === 3) {
        startBtn.disabled = !selectedFile || importData.length === 0;
    }
}

function nextStep() {
    if (currentStep < 3) {
        currentStep++;
        updateSteps();
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
        showStep(currentStep);
    }
}

function updateModeDescription() {
    const mode = document.getElementById('importMode').value;
    const description = document.getElementById('modeDescription');
    
    const descriptions = {
        'update': 'Update existing products with new data while keeping existing ones unchanged.',
        'add': 'Add only new products to your inventory. Existing products will be skipped.',
        'replace': 'Add new products and update existing ones. This is the most comprehensive option.'
    };
    
    description.textContent = descriptions[mode] || descriptions['update'];
}

function setupDragAndDrop() {
    const uploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('importFileModal');

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

function handleFileSelect() {
    const fileInput = document.getElementById('importFileModal');
    const file = fileInput.files[0];
    
    if (file) {
        selectedFile = file;
        
        // Show file name
        const uploadPlaceholder = document.querySelector('.upload-placeholder p');
        uploadPlaceholder.textContent = `Selected: ${file.name}`;
        
        // Preview file contents
        previewFile(file);
        
        // Enable next step if we're on step 2
        if (currentStep === 2) {
            document.getElementById('nextStep').disabled = false;
        }
    }
}

function previewFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length < 2) {
                showMessage('File must contain at least a header row and one data row.', 'error');
                return;
            }
            
            // Validate headers
            const headers = jsonData[0];
            const requiredHeaders = ['SKU', 'Product Name', 'Category', 'Quantity', 'Price'];
            const missingHeaders = requiredHeaders.filter(header => 
                !headers.some(h => h && h.toString().toLowerCase().includes(header.toLowerCase()))
            );
            
            if (missingHeaders.length > 0) {
                showMessage(`Missing required headers: ${missingHeaders.join(', ')}`, 'error');
                return;
            }
            
            // Convert to product format
            importData = jsonData.slice(1).map(row => {
                const product = {};
                headers.forEach((header, index) => {
                    if (header) {
                        const value = row[index];
                        switch (header.toString().toLowerCase()) {
                            case 'sku':
                                product.sku = value ? value.toString().trim() : '';
                                break;
                            case 'product name':
                            case 'productname':
                                product.name = value ? value.toString().trim() : '';
                                break;
                            case 'category':
                                product.category = value ? value.toString().trim() : '';
                                break;
                            case 'quantity':
                                product.quantity = parseInt(value) || 0;
                                break;
                            case 'price':
                                product.price = parseFloat(value) || 0;
                                break;
                            case 'min stock':
                            case 'minstock':
                                product.minStock = parseInt(value) || 10;
                                break;
                            case 'description':
                                product.description = value ? value.toString().trim() : '';
                                break;
                        }
                    }
                });
                return product;
            }).filter(product => product.sku && product.name); // Filter out empty rows
            
            showMessage(`File loaded successfully! Found ${importData.length} products to import.`, 'success');
            
            // Show file preview
            showFilePreview(jsonData.slice(0, 5)); // Show first 5 rows
            
            // Update import summary if on step 3
            if (currentStep === 3) {
                updateImportSummary();
            }
            
        } catch (error) {
            showMessage('Error reading file. Please ensure it\'s a valid Excel file.', 'error');
            console.error('File read error:', error);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function showFilePreview(data) {
    const previewDiv = document.getElementById('filePreview');
    const previewContent = document.querySelector('.preview-content');
    
    if (data.length === 0) {
        previewContent.innerHTML = '<p>No data found in file.</p>';
    } else {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '0.8rem';
        
        // Create header
        const header = document.createElement('tr');
        data[0].forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell || '';
            th.style.border = '1px solid #ddd';
            th.style.padding = '4px 8px';
            th.style.backgroundColor = '#f8f9fa';
            th.style.fontWeight = 'bold';
            header.appendChild(th);
        });
        table.appendChild(header);
        
        // Create data rows
        data.slice(1).forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell || '';
                td.style.border = '1px solid #ddd';
                td.style.padding = '4px 8px';
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        
        previewContent.innerHTML = '';
        previewContent.appendChild(table);
    }
    
    previewDiv.classList.remove('hidden');
}

function updateImportSummary() {
    const summaryDiv = document.getElementById('importSummary');
    const importMode = document.getElementById('importMode').value;
    
    const existingProducts = products.filter(p => 
        importData.some(importProduct => importProduct.sku === p.sku)
    ).length;
    
    const newProducts = importData.filter(importProduct => 
        !products.some(p => p.sku === importProduct.sku)
    ).length;
    
    summaryDiv.innerHTML = `
        <h4>Import Summary</h4>
        <div class="summary-item">
            <span class="summary-label">File Name:</span>
            <span class="summary-value">${selectedFile.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Total Products:</span>
            <span class="summary-value">${importData.length}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Import Mode:</span>
            <span class="summary-value">${importMode.charAt(0).toUpperCase() + importMode.slice(1)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Existing Products:</span>
            <span class="summary-value">${existingProducts}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">New Products:</span>
            <span class="summary-value">${newProducts}</span>
        </div>
    `;
}

function startImport() {
    if (!selectedFile || importData.length === 0) {
        showMessage('Please select a valid file first.', 'error');
        return;
    }
    
    const importMode = document.getElementById('importMode').value;
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const resultsDiv = document.getElementById('importResults');
    
    // Show progress and hide summary
    document.getElementById('importProgress').classList.remove('hidden');
    document.getElementById('importSummary').classList.add('hidden');
    document.getElementById('startImport').disabled = true;
    
    let results = {
        added: 0,
        updated: 0,
        errors: 0,
        details: []
    };
    
    // Process each product
    importData.forEach((product, index) => {
        const progress = ((index + 1) / importData.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Processing ${index + 1} of ${importData.length}...`;
        
        try {
            const result = processProduct(product, importMode);
            results.details.push(result);
            
            if (result.status === 'success') {
                if (result.action === 'added') results.added++;
                if (result.action === 'updated') results.updated++;
            } else {
                results.errors++;
            }
        } catch (error) {
            results.errors++;
            results.details.push({
                sku: product.sku,
                status: 'error',
                message: `Error: ${error.message}`
            });
        }
    });
    
    // Show results
    progressText.textContent = 'Import completed!';
    showImportResults(results);
    
    // Update the application
    updateDashboard();
    renderInventoryTable();
    updateReports();
    
    // Add activity
    addActivity(`${currentUser} imported ${results.added + results.updated} products from Excel file`);
    
    showMessage(`Import completed! ${results.added} added, ${results.updated} updated, ${results.errors} errors.`, 'success');
}

function processProduct(product, importMode) {
    // Validate product data
    if (!product.sku || !product.name || !product.category) {
        return {
            sku: product.sku || 'Unknown',
            status: 'error',
            message: 'Missing required fields (SKU, Product Name, Category)'
        };
    }
    
    if (product.quantity < 0 || product.price < 0) {
        return {
            sku: product.sku,
            status: 'error',
            message: 'Quantity and Price must be non-negative'
        };
    }
    
    const existingProductIndex = products.findIndex(p => p.sku === product.sku);
    
    switch (importMode) {
        case 'update':
            if (existingProductIndex === -1) {
                return {
                    sku: product.sku,
                    status: 'warning',
                    message: 'Product not found - skipped (update mode)'
                };
            }
            // Update existing product
            products[existingProductIndex] = {
                ...products[existingProductIndex],
                name: product.name,
                category: product.category,
                quantity: product.quantity,
                price: product.price,
                minStock: product.minStock || products[existingProductIndex].minStock,
                description: product.description || products[existingProductIndex].description
            };
            return {
                sku: product.sku,
                status: 'success',
                action: 'updated',
                message: 'Product updated successfully'
            };
            
        case 'add':
            if (existingProductIndex !== -1) {
                return {
                    sku: product.sku,
                    status: 'warning',
                    message: 'Product already exists - skipped (add mode)'
                };
            }
            // Add new product
            products.push({
                sku: product.sku,
                name: product.name,
                category: product.category,
                quantity: product.quantity,
                price: product.price,
                minStock: product.minStock || 10,
                description: product.description || ''
            });
            return {
                sku: product.sku,
                status: 'success',
                action: 'added',
                message: 'Product added successfully'
            };
            
        case 'replace':
            if (existingProductIndex !== -1) {
                // Update existing
                products[existingProductIndex] = {
                    ...products[existingProductIndex],
                    name: product.name,
                    category: product.category,
                    quantity: product.quantity,
                    price: product.price,
                    minStock: product.minStock || products[existingProductIndex].minStock,
                    description: product.description || products[existingProductIndex].description
                };
                return {
                    sku: product.sku,
                    status: 'success',
                    action: 'updated',
                    message: 'Product updated successfully'
                };
            } else {
                // Add new
                products.push({
                    sku: product.sku,
                    name: product.name,
                    category: product.category,
                    quantity: product.quantity,
                    price: product.price,
                    minStock: product.minStock || 10,
                    description: product.description || ''
                });
                return {
                    sku: product.sku,
                    status: 'success',
                    action: 'added',
                    message: 'Product added successfully'
                };
            }
    }
}

function showImportResults(results) {
    const resultsDiv = document.getElementById('importResults');
    const details = results.details.slice(0, 20); // Show first 20 results
    
    resultsDiv.innerHTML = `
        <h3>Import Results</h3>
        <div class="result-summary">
            <p><strong>Total processed:</strong> ${results.details.length}</p>
            <p><strong>Added:</strong> ${results.added}</p>
            <p><strong>Updated:</strong> ${results.updated}</p>
            <p><strong>Errors:</strong> ${results.errors}</p>
        </div>
        <div class="result-details">
            ${details.map(result => `
                <div class="result-item">
                    <span class="result-status ${result.status}">${result.status.toUpperCase()}</span>
                    <span class="result-message">${result.sku}: ${result.message}</span>
                </div>
            `).join('')}
            ${results.details.length > 20 ? `<p><em>... and ${results.details.length - 20} more results</em></p>` : ''}
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
}

function downloadTemplate() {
    const templateData = [
        {
            'SKU': 'LAP001',
            'Product Name': 'Dell Latitude Laptop',
            'Category': 'Electronics',
            'Quantity': 25,
            'Price': 899.99,
            'Min Stock': 10,
            'Description': 'Business laptop with Intel i7 processor'
        },
        {
            'SKU': 'PHN001',
            'Product Name': 'iPhone 15 Pro',
            'Category': 'Electronics',
            'Quantity': 8,
            'Price': 999.99,
            'Min Stock': 15,
            'Description': 'Latest iPhone with advanced camera system'
        },
        {
            'SKU': 'TSH001',
            'Product Name': 'Cotton T-Shirt',
            'Category': 'Clothing',
            'Quantity': 150,
            'Price': 19.99,
            'Min Stock': 50,
            'Description': 'Comfortable cotton t-shirt in various sizes'
        }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Template');
    
    // Add instructions sheet
    const instructionsData = [
        ['Instructions for Importing Inventory'],
        [''],
        ['Required Columns:'],
        ['SKU', 'Product Name', 'Category', 'Quantity', 'Price'],
        [''],
        ['Optional Columns:'],
        ['Min Stock', 'Description'],
        [''],
        ['Notes:'],
        ['- SKU must be unique for each product'],
        ['- First row should contain column headers'],
        ['- Quantity and Price must be non-negative numbers'],
        ['- Category should match existing categories or will be added'],
        ['- Min Stock defaults to 10 if not specified'],
        ['- Description is optional']
    ];
    
    const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');
    
    XLSX.writeFile(workbook, 'warehouse_inventory_template.xlsx');
    
    showMessage('Template downloaded successfully!', 'success');
} 