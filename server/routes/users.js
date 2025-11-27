import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.put('/avatar', authenticateToken, (req, res) => {
  const { avatar } = req.body;
  if (!avatar) return res.status(400).json({ error: 'Avatar required' });

  const stmt = db.prepare('UPDATE users SET avatar = ? WHERE id = ?');
  stmt.run(avatar, req.user.id);

  res.json({ success: true, avatar });
});

export default router;
