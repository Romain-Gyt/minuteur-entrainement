import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const stmt = db.prepare(`
    SELECT s.*, w.name as workout_name, w.data as workout_data
    FROM schedules s
    JOIN workouts w ON s.workout_id = w.id
    WHERE s.user_id = ?
    ORDER BY s.date ASC, s.time ASC
  `);
  const schedules = stmt.all(req.user.id);
  res.json(schedules);
});

router.post('/', authenticateToken, (req, res) => {
  const { workout_id, date, time } = req.body;

  if (!workout_id || !date || !time) {
    return res.status(400).json({ error: 'Workout ID, date and time required' });
  }

  // Validate date is not in the past
  const scheduleDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Reset schedule date time to midnight for fair comparison
  scheduleDate.setHours(0, 0, 0, 0);

  if (scheduleDate < today) {
    return res.status(400).json({ error: 'Cannot schedule workouts in the past' });
  }

  try {
    const stmt = db.prepare('INSERT INTO schedules (user_id, workout_id, date, time) VALUES (?, ?, ?, ?)');
    const info = stmt.run(req.user.id, workout_id, date, time);
    res.json({ id: info.lastInsertRowid, workout_id, date, time });
  } catch (err) {
    console.error("Database error creating schedule:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  const stmt = db.prepare('DELETE FROM schedules WHERE id = ? AND user_id = ?');
  const info = stmt.run(req.params.id, req.user.id);

  if (info.changes === 0) return res.status(404).json({ error: 'Schedule not found' });
  res.json({ success: true });
});

export default router;
