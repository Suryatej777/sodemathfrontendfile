# Sri Sode Vadiraja Matha 🕉️

A modern spiritual heritage app for Sri Sode Vadiraja Matha, built with React (Vite) and Go backend.

## Features

- 🏛️ **Temple Information** - Darshan timings, history, and about the Matha
- 🙏 **Seva Booking** - Book various sevas online
- 📅 **Events** - View upcoming festivals and events
- 📸 **Media Gallery** - Photos and videos of the Matha
- 🏨 **Accommodation** - Room booking information
- 👤 **User Authentication** - Email OTP verification via Brevo
- 🛡️ **Admin Dashboard** - Manage sevas, events, and users

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Lucide Icons

### Backend
- Go (Golang)
- Gin Web Framework
- GORM (PostgreSQL)
- Firebase Admin SDK
- Brevo Email API

## Getting Started

### Prerequisites
- Node.js 18+
- Go 1.21+
- PostgreSQL

### Frontend Setup
```bash
cd sode-matha-web
npm install
npm run dev
```

### Backend Setup (Node.js) - Recommended
```bash
cd backend-node
# Create .env file with your configuration (see .env.example if available)
npm install
npm run dev
```

### Backend Setup (Go) - Legacy
```bash
cd backend
# Create .env file with database config
go mod download
go run .
```

### Environment Variables (Backend)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=sode_matha
```

## Git & Dependencies
Your `node_modules` are ignored by Git to keep the repository light. To "link" and restore them on any new machine:
1.  **Frontend**: Run `npm install` in the root folder.
2.  **Backend**: Run `npm install` in the `backend-node` folder.

## Admin Access
- Email: `admin@sodematha.org`
- Password: `admin123`

## License
MIT

---
Built with ❤️ for Sri Sode Vadiraja Matha, Sode, Karnataka
