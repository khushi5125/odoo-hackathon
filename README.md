# Dayflow HRMS - Human Resource Management System

A comprehensive MERN stack HRMS solution built for the Odoo Hackathon 2025.

## 🚀 **Quick Start Guide**

### **Step 1: Prerequisites**
- **Node.js** (v16+)
- **MongoDB** (installed and running)
- **Git** (optional)

### **Step 2: Install Dependencies**
```bash
cd dayflow-hrms
npm run install-all
```

### **Step 3: Set Up Environment Variables**
Create `.env` file in `backend/` folder:
```bash
cd backend
```

Create `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/dayflow-hrms
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### **Step 4: Start MongoDB**
Make sure MongoDB is running:
```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongod
# or
mongod
```

### **Step 5: Run the Application**

#### **Development Mode (Recommended)**
```bash
# From root directory
npm run dev
```
This starts both backend (port 5000) and frontend (port 3000) simultaneously with proxy setup.

#### **Or Start Separately**
```bash
# Terminal 1 - Start Backend
npm run server

# Terminal 2 - Start Frontend  
npm run client
```

### **Step 6: Access the Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### **Default Login Credentials**
After registering, you can login with:
- **Admin:** admin@dayflow.com / admin123
- **HR:** hr@dayflow.com / hr123  
- **Employee:** employee@dayflow.com / emp123
