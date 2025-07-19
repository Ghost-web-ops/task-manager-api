import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// --- POST /api/cards ---
// إنشاء بطاقة جديدة
router.post('/cards', authMiddleware, async (req, res) => {
    try {
        const { title, list_id, order } = req.body;
        const newCard = await pool.query(
          'INSERT INTO cards (title, list_id, "order") VALUES ($1, $2, $3) RETURNING *',
          [title, list_id, order]
        );
        res.status(201).json(newCard.rows[0]);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
      }
});


// --- PATCH /api/cards/:cardId ---
// تحديث بطاقة (لتغيير مكانها)
router.patch('/cards/:cardId', authMiddleware, async (req, res) => {
    try {
        const { cardId } = req.params;
        const { list_id, order } = req.body; // البيانات الجديدة

        const updatedCard = await pool.query(
            'UPDATE cards SET list_id = $1, "order" = $2 WHERE id = $3 RETURNING *',
            [list_id, order, cardId]
        );

        if (updatedCard.rows.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(updatedCard.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

export default router;