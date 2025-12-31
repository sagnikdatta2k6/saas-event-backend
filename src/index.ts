import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http'; // NEW: Built-in Node module
import { Server } from 'socket.io'; // NEW: Socket.io library

import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import ticketRoutes from './routes/ticket.routes';
import teamRoutes from './routes/team.routes';

import announcementRoutes from './routes/announcement.routes';
import analyticsRoutes from './routes/analytics.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Create a standard HTTP server that wraps Express
const server = http.createServer(app);

// 2. Initialize Socket.io on that server
// cors: "*" means we allow any website to connect (good for development)
export const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Event Platform API is running!');
});

// 3. Listen for new socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Allow a client to "join" a specific event room (e.g., "event-123")
  socket.on('join-event', (eventId) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined room: ${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// IMPORTANT: Change "app.listen" to "server.listen"
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});