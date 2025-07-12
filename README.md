# Warehouse Inventory Management System (WMS)

A modern, web-based warehouse inventory management system built with HTML, CSS, and JavaScript. This system provides comprehensive inventory tracking, management, and reporting capabilities.

## Features

### 🔐 User Authentication & Roles
- **Multi-role system**: Admin, Warehouse Worker, Supervisor
- **Secure login** with role-based access control
- **Demo credentials** provided for testing

### 📊 Dashboard
- **Real-time statistics**: Total products, low stock alerts, total value, categories
- **Visual charts**: Stock levels and category distribution
- **Recent activity feed**: Track all system activities

### 📦 Inventory Management
- **Product management**: Add, edit, delete products
- **Search & filter**: Find products by name, category, or SKU
- **Stock tracking**: Monitor quantities and set minimum stock levels
- **Status indicators**: Visual status badges for stock levels

### 📈 Excel Import/Export
- **Excel Import**: Bulk import inventory from Excel files
  - Supports .xlsx and .xls formats
  - Drag & drop file upload
  - Multiple import modes: Update, Add, Replace
  - Real-time validation and error reporting
  - Progress tracking with detailed results
- **Excel Export**: Export current inventory to Excel
- **Template download**: Get a pre-formatted Excel template

### 📱 Barcode Scanner
- **Simulated scanner**: Manual SKU entry for testing
- **Product lookup**: Instant product information display
- **Stock updates**: Quick quantity adjustments

### 📋 Reports & Analytics
- **Low stock reports**: Identify items needing restocking
- **Category distribution**: Visual breakdown by category
- **Value analysis**: Total value by category
- **Stock movement**: Track inventory changes over time

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download or clone the repository
2. Open `index.html` in your web browser
3. Use the demo credentials to log in

### Demo Credentials
- **Admin**: `admin` / `admin123`
- **Worker**: `worker` / `worker123`
- **Supervisor**: `supervisor` / `sup123`

## Excel Import Guide

### Supported File Formats
- Microsoft Excel (.xlsx)
- Legacy Excel (.xls)

### Required Columns
- **SKU** (required): Unique product identifier
- **Product Name** (required): Product name/description
- **Category** (required): Product category
- **Quantity** (required): Current stock quantity
- **Price** (required): Product price

### Optional Columns
- **Min Stock**: Minimum stock level (defaults to 10)
- **Description**: Product description

### Import Modes
1. **Update**: Only update existing products (skip new ones)
2. **Add**: Only add new products (skip existing ones)
3. **Replace**: Add new products and update existing ones

### File Format Example
```csv
SKU,Product Name,Category,Quantity,Price,Min Stock,Description
LAP001,Dell Latitude Laptop,Electronics,25,899.99,10,Business laptop with Intel i7 processor
PHN001,iPhone 15 Pro,Electronics,8,999.99,15,Latest iPhone with advanced camera system
```

### Import Process
1. Click "Import from Excel" in the Inventory section
2. Download the template (optional) for proper formatting
3. Select your Excel file (drag & drop supported)
4. Choose import mode
5. Review validation results
6. Start import and monitor progress
7. Review detailed import results

## Data Storage

All data is stored locally in the browser using localStorage:
- **Products**: Complete inventory data
- **Activities**: System activity log
- **User sessions**: Current user information

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Features by Role

### Admin
- Full access to all features
- Can manage all inventory
- Access to all reports

### Warehouse Worker
- View inventory
- Update quantities
- Scan barcodes
- Basic reporting

### Supervisor
- All worker permissions
- Add/edit products
- Import/export data
- Advanced reporting

## Technical Details

### Libraries Used
- **SheetJS (XLSX)**: Excel file processing
- **Font Awesome**: Icons
- **Vanilla JavaScript**: Core functionality

### File Structure
```
WMS_Example/
├── index.html          # Main application
├── styles.css          # Styling and layout
├── script.js           # Application logic
└── README.md           # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the documentation
2. Review the demo credentials
3. Test with the provided sample data
4. Create an issue in the repository

---

**Note**: This is a demonstration system. For production use, consider implementing proper backend services, database storage, and security measures.