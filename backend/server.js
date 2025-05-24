const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const queueRoutes = require('./routes/queueRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');
const http = require('http'); // ✅ for Socket.IO
const { Server } = require('socket.io');


// ✅ Load environment variables
dotenv.config();

connectDB(); // <-- this runs the actual connection logic

const app = express();
const server = http.createServer(app); // ✅ Wrap express in HTTP server

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // your frontend
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'http://localhost:3000', // your frontend
  credentials: true
}));
app.use(express.json());
app.use('/api/queue', queueRoutes);
app.use('/api/messages', messageRoutes);

// ✅ WebSocket connection
io.on('connection', (socket) => {
  console.log('🧠 Socket connected:', socket.id);

  socket.on('joinRoom', (ticketId) => {
    socket.join(ticketId);
    console.log(`🔗 User joined room: ${ticketId}`);
  });

  socket.on('sendMessage', (message) => {
    io.to(message.ticketId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));