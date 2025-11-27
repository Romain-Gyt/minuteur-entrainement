import express from 'express';
import db from '../database.js';
import { authenticateToken, ensureWorkoutOwner } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const stmt = db.prepare('SELECT * FROM workouts WHERE user_id = ? ORDER BY created_at DESC');
  const workouts = stmt.all(req.user.id);

  const parsedWorkouts = workouts.map(w => ({
    ...w,
    data: JSON.parse(w.data)
  }));

  res.json(parsedWorkouts);
});

router.post('/', authenticateToken, (req, res) => {
  const { name, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'Name and data required' });

  const stmt = db.prepare('INSERT INTO workouts (user_id, name, data) VALUES (?, ?, ?)');
  const info = stmt.run(req.user.id, name, JSON.stringify(data));

  res.json({ id: info.lastInsertRowid, name, data });
});

router.put('/:id', authenticateToken, ensureWorkoutOwner, (req, res) => {
  const { name, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'Name and data required' });

  const stmt = db.prepare('UPDATE workouts SET name = ?, data = ? WHERE id = ?');
  const info = stmt.run(name, JSON.stringify(data), req.params.id);

  res.json({ success: true, id: req.params.id, name, data });
});

router.delete('/:id', authenticateToken, ensureWorkoutOwner, (req, res) => {
  const stmt = db.prepare('DELETE FROM workouts WHERE id = ?');
  const info = stmt.run(req.params.id);

  res.json({ success: true });
});

router.get('/:id', authenticateToken, ensureWorkoutOwner, (req, res) => {
    const stmt = db.prepare('SELECT * FROM workouts WHERE id = ?');
    const workout = stmt.get(req.params.id);

    res.json({
        ...workout,
        data: JSON.parse(workout.data)
    });
});

export default router;
