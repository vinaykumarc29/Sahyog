import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import teamRoutes from './routes/teams.js';
import messageRoutes from './routes/messages.js';
import searchRoutes from './routes/search.js';
import socketHandler from './socket/socketHandler.js';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL }
});

app.set('io', io);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);

socketHandler(io);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});