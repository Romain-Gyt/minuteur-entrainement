import jwt from 'jsonwebtoken';
import db from '../database.js';

const SECRET_KEY = process.env.SECRET_KEY || 'fallback-secret-key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const ensureWorkoutOwner = (req, res, next) => {
  const workoutId = req.params.id;
  const userId = req.user.id;

  // If no ID provided, skip (should be handled by route definition, but safe check)
  if (!workoutId) return next();

  try {
    const stmt = db.prepare('SELECT user_id FROM workouts WHERE id = ?');
    const workout = stmt.get(workoutId);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this workout' });
    }

    next();
  } catch (err) {
    console.error("Error in ensureWorkoutOwner:", err);
    res.status(500).json({ error: 'Internal server error during ownership check' });
  }
};
