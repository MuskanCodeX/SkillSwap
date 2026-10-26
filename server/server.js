const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const Message = require('./models/Message');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connect
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('SkillSwap Backend Server running perfectly!');
});

// Socket.IO Real-time Logic
io.on('connection', (socket) => {
  console.log(`User connected to Socket: ${socket.id}`);

  // User joins a specific exchange session room
  socket.on('join_session', (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session room: ${sessionId}`);
  });

  // Jab koi message bhejta hai
  socket.on('send_message', async (data) => {
    const { sessionId, senderId, text } = data;

    try {
      // 1. Database me message save karo
      const newMessage = new Message({
        sessionId,
        sender: senderId,
        text,
      });
      await newMessage.save();

      const populatedMessage = await Message.findById(newMessage._id).populate(
        'sender',
        'name'
      );

      // 2. Us room ke sabhi users ko live message bhej do
      io.to(sessionId).emit('receive_message', populatedMessage);
    } catch (err) {
      console.error('Socket message error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});