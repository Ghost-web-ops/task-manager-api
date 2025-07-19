import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js'; // استيراد الحارس

const router = express.Router();

// --- GET /api/boards ---
// جلب كل اللوحات الخاصة بالمستخدم الحالي
// هذا المسار محمي، سيتم تنفيذ authMiddleware أولاً
router.get('/boards', authMiddleware, async (req, res) => {
  try {
    // req.user.id يأتي من الـ middleware بعد التحقق من التوكن
    const allBoards = await pool.query(
      'SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(allBoards.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// --- POST /api/boards ---
// إنشاء لوحة جديدة
// هذا المسار محمي أيضًا
router.post('/boards', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const newBoard = await pool.query(
      'INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, req.user.id]
    );

    res.status(201).json(newBoard.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

export default router;