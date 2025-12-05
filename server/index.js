import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from './middleware/logger.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import scheduleRoutes from './routes/schedules.js';
import workoutRoutes from './routes/workouts.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

console.log("---------------------------------------------------");
console.log("SERVER STARTING - MODULAR ARCHITECTURE");
console.log("---------------------------------------------------");

// Permissive CORS for debugging
app.use(cors({
  origin: true, // Allow any origin
  credentials: true
}));

app.use(express.json());

// Logging Middleware
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/workouts', workoutRoutes);

// Serve static files from the Vue app build
app.use(express.static(path.join(__dirname, '../dist')));

// Handle SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
