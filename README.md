# Warehouse Inventory Management System

A modern, responsive web-based inventory management system designed for warehouse operations. This project demonstrates full-stack development skills with a focus on warehouse-specific functionality.

## 🚀 Features

### Core Functionality
- **Product Catalog Management** - Add, edit, and delete products with SKU tracking
- **Stock Level Monitoring** - Real-time inventory tracking with low stock alerts
- **Barcode Scanner Simulation** - Manual SKU entry with product lookup
- **Excel Export** - Export inventory data to Excel format
- **User Authentication** - Role-based access control (Admin, Worker, Supervisor)

### Dashboard & Analytics
- **Real-time Dashboard** - Overview of total products, low stock alerts, total value, and categories
- **Stock Level Charts** - Visual representation of inventory levels
- **Recent Activity Tracking** - Log of all system activities
- **Category Distribution** - Analytics by product category
- **Value Analytics** - Inventory value breakdown by category

### User Interface
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional interface with smooth animations
- **Search & Filter** - Find products quickly by name, SKU, or category
- **Status Indicators** - Visual status badges for stock levels (In Stock, Low Stock, Out of Stock)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Flexbox and Grid layouts
- **Icons**: Font Awesome 6.0
- **Data Export**: SheetJS (XLSX) library
- **Data Storage**: Browser localStorage
- **Charts**: Custom CSS-based visualizations

## 📋 Demo Credentials

Use these credentials to test the system:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Worker | worker | worker123 |
| Supervisor | supervisor | sup123 |

## 🏗️ Project Structure

```
WMS_example/
├── index.html          # Main application file
├── styles.css          # All styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # Project documentation
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Login** using one of the demo credentials above
4. **Explore** the different sections:
   - Dashboard: Overview and analytics
   - Inventory: Product management table
   - Add Product: Create new inventory items
   - Barcode Scanner: Look up products by SKU
   - Reports: Detailed analytics and reports

## 📊 Sample Data

The system comes pre-loaded with sample inventory data including:
- Electronics (Laptops, Phones)
- Clothing (T-Shirts)
- Sports Equipment (Running Shoes)
- Books (Programming Guides)
- Automotive (Air Fresheners)

## 🔧 Key Features Explained

### 1. Product Management
- **SKU Tracking**: Unique identifier for each product
- **Category Organization**: Products organized by category
- **Stock Levels**: Current quantity and minimum stock thresholds
- **Price Management**: Individual product pricing
- **Descriptions**: Detailed product information

### 2. Stock Alerts
- **Low Stock Detection**: Automatic alerts when quantity falls below minimum
- **Visual Indicators**: Color-coded status badges
- **Dashboard Overview**: Quick view of all low stock items

### 3. Barcode Scanner Simulation
- **Manual Entry**: Enter SKU codes manually
- **Product Lookup**: Instant product information display
- **Status Display**: Current stock status for scanned items

### 4. Excel Export
- **Complete Inventory**: Export all product data
- **Formatted Data**: Clean, organized spreadsheet format
- **Date Stamping**: Files named with current date
- **Calculated Fields**: Includes total value calculations

### 5. Activity Tracking
- **User Actions**: Log of all system activities
- **Timestamp Recording**: When actions occurred
- **Recent Activity**: Dashboard display of latest actions

## 🎨 Design Features

### Responsive Layout
- **Mobile-First**: Optimized for mobile devices
- **Flexible Grid**: Adapts to different screen sizes
- **Touch-Friendly**: Large buttons and touch targets

### Visual Design
- **Modern Gradient**: Professional color scheme
- **Card-Based Layout**: Clean, organized information display
- **Smooth Animations**: Hover effects and transitions
- **Status Colors**: Intuitive color coding for stock levels

### User Experience
- **Intuitive Navigation**: Clear section organization
- **Form Validation**: Real-time input validation
- **Success/Error Messages**: Clear feedback for user actions
- **Loading States**: Visual feedback during operations

## 🔒 Security Features

### Authentication
- **Role-Based Access**: Different permissions per user role
- **Session Management**: User state tracking
- **Secure Logout**: Proper session termination

### Data Validation
- **Input Sanitization**: Prevents invalid data entry
- **SKU Uniqueness**: Prevents duplicate product codes
- **Required Fields**: Ensures complete data entry

## 📈 Business Value

This system demonstrates understanding of:
- **Warehouse Operations**: Real-world inventory management needs
- **Business Processes**: Stock tracking and alert systems
- **Data Management**: Product catalog and analytics
- **User Experience**: Intuitive interface for warehouse workers
- **Reporting**: Business intelligence and data export

## 🚀 Future Enhancements

Potential improvements for a production system:
- **Real Barcode Scanning**: Integration with actual barcode scanners
- **Database Integration**: Backend database for data persistence
- **API Integration**: Connect with shipping and supplier systems
- **Advanced Analytics**: More sophisticated reporting and charts
- **Multi-Warehouse Support**: Manage multiple warehouse locations
- **Mobile App**: Native mobile application
- **Real-time Updates**: WebSocket connections for live data
- **Print Support**: Generate shipping labels and packing slips

## 💼 Portfolio Value

This project showcases:
- **Full-Stack Development**: Frontend and backend logic
- **Database Design**: Data modeling and relationships
- **API Development**: Data manipulation and export
- **UI/UX Design**: User interface and experience
- **Business Logic**: Real-world application development
- **Problem Solving**: Warehouse-specific challenges
- **Documentation**: Clear project documentation

## 📝 Usage Instructions

### Adding Products
1. Navigate to "Add Product" section
2. Fill in all required fields (SKU, Name, Category, Quantity, Price)
3. Set minimum stock level for alerts
4. Add optional description
5. Click "Add Product"

### Managing Inventory
1. Go to "Inventory" section
2. Use search to find specific products
3. Filter by category if needed
4. Click edit/delete buttons for product management
5. Export data using "Export to Excel" button

### Scanning Products
1. Navigate to "Barcode Scanner" section
2. Enter SKU in the input field
3. Click "Scan" or press Enter
4. View detailed product information

### Viewing Reports
1. Go to "Reports" section
2. Review low stock alerts
3. Analyze category distribution
4. Check inventory value by category
5. Monitor recent stock movements

## 🤝 Contributing

This is a portfolio project demonstrating warehouse management system development. Feel free to:
- Fork the project for your own portfolio
- Modify features to match your specific needs
- Add new functionality to enhance the system
- Use as a starting point for more complex applications

## 📄 License

This project is open source and available for educational and portfolio purposes.

---

**Built with ❤️ for warehouse management and software development portfolios** 