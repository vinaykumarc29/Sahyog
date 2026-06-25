import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import teamRoutes from './routes/teams.js';
import messageRoutes from './routes/messages.js';
import searchRoutes from './routes/search.js';


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users' , userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => res.json({ message: 'Sahyog API running' }));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});