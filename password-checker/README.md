# 🔐 PassGuard — Password Strength Checker SaaS
**Vibe Coder Internship — Week 4**

A full-stack password strength checker with real-time analysis, crack time estimation, and security suggestions.

## 📁 Structure
```
frontend/
└── index.html          → Complete frontend (works standalone too)
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/passwordController.js
│   └── routes/passwordRoutes.js
├── tests/password.test.js
└── package.json
docs/
├── API_DOCS.md
└── CONTRIBUTING.md
```

## 🚀 Quick Start

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm start        # runs on port 4000

# Frontend
# Open frontend/index.html in browser
# (works without backend too — has client-side fallback)
```

## 🧪 Tests
```bash
cd backend && npm test
```

## 🌐 Deploy to Vercel
- Frontend: drag `frontend/` folder to vercel.com
- Backend: deploy `backend/` as a Node.js serverless function

## ✨ Features
- Real-time strength analysis as you type
- Crack time estimation
- 9 security checks (length, uppercase, symbols, etc.)
- Common password detection
- Passphrase suggestions
- Works offline (client-side fallback)
- Rate limited + helmet security headers

---
*Built for Vibe Coder Internship — Week 4*
