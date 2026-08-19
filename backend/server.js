import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import complaintsRoutes from './routes/complaints.js';
import categoriesRoutes from './routes/categories.js';
import caretakersRoutes from './routes/caretakers.js';
import noticesRoutes from './routes/notices.js';
import eventsRoutes from './routes/events.js';
import maintenanceRoutes from './routes/maintenance.js';
import lostFoundRoutes from './routes/lostFound.js';
import notificationsRoutes from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/caretakers', caretakersRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/notifications', notificationsRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Campus Voice backend running on port ${PORT}`);
});

export default app;
