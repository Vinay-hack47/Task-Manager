# 🚀 Team Task Manager (Full-Stack)

A full-stack task management application where users can create projects, invite team members, assign tasks, and track progress with role-based access control.

## 🚀 Live Demo

🔗 https://task-manager-production-0457.up.railway.app

## 📌 Features

### 🔐 Authentication

* User Signup & Login (JWT + Refresh Token)
* Protected Routes
* Secure password handling

### 👥 Project & Team Management

* Create/Delete Projects
* Invite users via email (token-based system)
* Accept invite and join project
* Role-based access (Admin / Member)

### ✅ Task Management

* Create, Edit, Delete Tasks
* Assign tasks to team members
* Task status tracking (Todo → In Progress → Done)
* Priority levels (Low, Medium, High)
* Deadline support with overdue highlighting

### 📊 Dashboard

* View all projects
* Task overview
* Overdue indicators

### 📧 Email System

* Project invitation emails
* Task assignment notifications (on create & update)

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Nodemailer (Email Service)

### Frontend

* React.js
* Redux Toolkit
* Tailwind CSS
* shadcn/ui

---

## ⚙️ Prerequisites

* Node.js (v18+)
* MongoDB Atlas (or local MongoDB)
* Gmail App Password (for email service)

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

FRONTEND_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running the Application

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

## 📡 API Endpoints

### Auth

* POST /api/auth/signup
* POST /api/auth/login

### Projects

* GET /api/projects
* POST /api/projects
* DELETE /api/projects/:projectId
* POST /api/projects/:projectId/invite
* POST /api/projects/accept-invite/:token

### Tasks

* GET /api/tasks/:projectId
* POST /api/tasks/:projectId
* PATCH /api/tasks/:taskId
* DELETE /api/tasks/:taskId

---

## 📧 Email Flow

* Invite user → email with secure token link
* Accept invite → user joins project
* Assign task → email sent automatically

---

## 🌐 Deployment

* Backend & Frontend deployed on Railway
* MongoDB hosted on Atlas

---

## 🧠 Future Improvements

* Drag & Drop (Kanban)
* Real-time updates (Socket.io)
* Activity logs
* Notifications system

---

## 📄 License

This project is licensed under the MIT License.
