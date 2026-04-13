# 🌍 HazardWatch

**HazardWatch** is a platform for **tracking and reporting environmental hazards** across Ghana.  
Enabling communities, authorities, and organizations to stay updated on incidents nationwide.  

---

## 📌 Resources

- 🎨 **Figma Design**: [View on Figma](https://www.figma.com/design/0bLAmyRfjGEnX46mOAlq4G/Ghana-Hazard-Report?node-id=22-175)  
- 📖 **API Documentation (Swagger)**: Available at `http://localhost/api-docs` (run backend locally)
- 📖 **Legacy API Documentation (Postman)**: [View Documentation](https://documenter.getpostman.com/view/38771706/2sAY518ziL)  
- 🌍 **Live URL**: [ghana-hazard-reporter.vercel.app](https://ghana-hazard-reporter.vercel.app/)

---

## 🚀 Project Goals

- Provide a **digital platform for real-time hazard reporting**.  
- Allow citizens to **report, track, and visualize environmental hazards**.  
- Support authorities and NGOs in **making informed, data-driven interventions**.  
- Create a **centralized, accessible hazard awareness hub** for Ghana.  

---

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Admin Dashboard**: React with TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js (Express) with TypeScript, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI 3.0

---

## 📁 Project Structure

```
HazardWatch/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── controllers/  # Business logic for routes
│   │   ├── routes/       # API route definitions
│   │   ├── models/       # MongoDB schemas
│   │   ├── middlewares/  # Auth, upload, validation middleware
│   │   ├── services/     # Email, cloud storage services
│   │   └── config/       # Configuration & logging
│   └── package.json
│
├── frontend/             # User-facing React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client services
│   │   └── types/        # TypeScript type definitions
│   └── package.json
│
└── admin-dashboard/      # Admin panel React application
    ├── src/
    │   ├── components/   # Admin UI components
    │   ├── pages/        # Admin pages
    │   └── services/     # API integrations
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mestafrica/HazardWatch.git
   cd HazardWatch
   ```

2. **Configure environment variables**
   
   Create `.env` files for each service:
   
   **Backend** (`.backend/.env`):
   ```
   MONGO_URL=your_mongo_URI
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

3. **Install dependencies and start services**

   **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   # Server runs on http://localhost:1337
   # Swagger docs available at http://localhost:1337/api-docs
   ```

   **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Admin Dashboard**:
   ```bash
   cd admin-dashboard
   npm install
   npm run dev
   ```

---

## 🔄 CI/CD Pipeline

**Before pushing**, run locally:
```bash
# Backend
cd backend && npm run lint && npm run test && npm run build

# Frontend
cd frontend && npm run lint && npm run test && npm run build

# Admin Dashboard
cd admin-dashboard && npm run lint && npm run build
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork & Branch
```bash
git fork https://github.com/mestafrica/HazardWatch.git
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Follow the code structure outlined above
- Use **TypeScript** for type safety
- Add JSDoc comments for public functions
- Update Swagger docs for new API endpoints

### 3. Test Locally
```bash
# Test all three services
cd backend && npm run lint && npm run test && npm run build
cd ../frontend && npm run lint && npm run build
cd ../admin-dashboard && npm run lint && npm run build
```

### 4. Commit & Push
```bash
git add .
git commit -m "feat: clear description of what changed"
git push origin feature/your-feature-name
```

### 5. Create Pull Request
- Target the `dev` branch for features
- Include a clear description of changes
- Wait for CI/CD checks to pass
- Request review from maintainers

### Code Standards
- Use **consistent naming**: `camelCase` for variables, `PascalCase` for classes/components
- Keep functions **under 50 lines** (split large functions)
- Add **error handling** for all async operations
- Write **descriptive commit messages**
- Include **input validation** for all endpoints

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
