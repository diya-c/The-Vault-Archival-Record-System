# 📚 The Vault: Archival Records System

A full-stack web app for managing historical archive items with metadata tracking, user roles, and access logging.

## 🎯 Overview

 **The Vault** helps manage digital archives with:
- 🔐 Role-based authentication (Admin/User)
- 🗂️ Archive item management (eg: Articles, Images, Videos)
- 🏛️ Collection categories (eg: Chola, Hoysala, Mughal)
- 👥 Contributor management
- 📊 Access logging & analytics
- 🔍 Advanced search and filtering

---

## 🏗️ Architecture

### Database (MySQL)
- **6 Entities**: User, ArchiveItem, ItemType, Collection, Contributor, Access  
- 3NF normalized schema with **foreign keys**, **triggers**, **views**, and **stored procedures**

### Backend (Node.js + Express)
- REST API with JWT authentication  
- Role-based authorization middleware  
- MySQL2 + dotenv + CORS

### Frontend (React)
- Responsive UI with separate **Admin/User dashboards**  
- Real-time search & filtering  
- Axios-based API communication  

---

## 🚀 Setup

### Prerequisites
- Node.js ≥14  
- MySQL ≥8  

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/archival-records-system.git
cd archival-records-system
```

**Database**
```bash
mysql -u root -p < database/schema.sql
```

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # Add MySQL credentials
npm run dev
```

**Frontend**
```bash
cd ../frontend
npm install
npm start
```

Frontend → `http://localhost:3000`  
Backend → `http://localhost:5000`

---

## 🔐 Default Credentials

| Role | Username | Password |
|------|-----------|-----------|
| Admin | admin | admin123 |
| User | user1 | user123 |

> ⚠️ Change these in production.

---

## 🧭 Features

### Users
- Browse/search archive items  
- Filter by type or collection  
- View detailed metadata & contributors  

### Admin
- Add/Edit/Delete items & contributors  
- Manage users & roles  
- View access logs & usage statistics  

---

## 📁 Structure

```
archival-records-system/
├── backend/      # Node.js + Express API
├── frontend/     # React UI
├── database/     # SQL schema & data
└── README.md
```

---

## 👥 Contributor
**Diya Chandrashekhar** — [GitHub](https://github.com/diya-c)

---
