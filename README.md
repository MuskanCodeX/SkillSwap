# SkillSwap 🔄

A peer-to-peer skill exchange platform built with the MERN stack and Socket.IO. SkillSwap allows users to trade practical skills with one another (e.g., teaching Java in exchange for learning UI/UX Design) without financial transactions.

## 🚀 Key Features

- **Authentication & Authorization**: Secure signup/login with JWT and Bcrypt.
- **Skill Discovery & Matching**: Search engine to find peers based on skills offered and skills wanted.
- **Session Booking Workflow**: Send swap requests, manage incoming requests, and accept/reject them from an interactive dashboard.
- **Real-Time P2P Chat**: Live bi-directional chat powered by Socket.IO with chat history persisted in MongoDB.
- **Review & Rating System**: Users can rate completed sessions (1-5 stars) and write feedback, updating peer credibility scores.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Axios, React Router DOM, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO, JSON Web Tokens (JWT)
- **Database**: MongoDB & Mongoose

## 📂 Project Structure

```text
SkillSwap/
├── client/          # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
├── server/          # Backend Node.js & Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── README.md
