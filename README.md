# 🔮 Astrology Consultation App

A full-stack real-time astrology consultation platform where customers can join a queue, chat with an astrologer, and view message history. The astrologer has a secure inbox to view and respond to all active consultations.

---

## ✨ Features

### 🌐 Public / Customer Side
- Join the consultation queue with name, email, and question
- Each user receives a unique `ticketId` and priority number
- Real-time 1-on-1 chat with the astrologer
- Login/Signup system for secure chat access
- View full message history

### 🔐 Astrologer Portal
- Login-only access
- Inbox with all active customer chats
- Real-time response to any customer
- View full chat history for each consultation

### 📊 Admin Metrics
- Homepage shows the number of active (unresolved) queue entries

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Node.js + Express.js + Socket.IO
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT-based (separate roles for customer and astrologer)
- **Real-time Chat**: Socket.IO with REST persistence

---

## 🚀 Local Development

### 🔧 Prerequisites

- Node.js
- MongoDB (local or Atlas)
- Git

### 📁 Project Structure

astro-consultation-app/
├── backend/ # Express + MongoDB + Socket.IO
├── frontend/ # Next.js frontend

### 🔨 Backend Setup
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI to .env
npm run dev

### 🎨 Frontend Setup
cd frontend
npm install
npm run dev
Visit: http://localhost:3000

### 📦 API Overview
POST /api/queue/join — Join queue
GET /api/messages/:ticketId — Get message history
POST /api/messages/send — Send a message
GET /api/messages — Astrologer inbox 
POST /api/auth/signup — Signup
POST /api/auth/login — Login

### 🛡️ Roles & Access
| Role       | Access                                      |
| ---------- | ------------------------------------------- |
| Customer   | Join queue, chat with astrologer, view chat |
| Astrologer | View inbox, chat with all customers         |

### ✍️ Author
Made with ❤️ by Yashikha Dhiman


```bash