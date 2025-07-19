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
router.patch('/cards/:cardId', authMiddleware, async (req, res) => {
    try {
        const { cardId } = req.params;
        const { title, description, list_id, order } = req.body;

        // بناء الاستعلام بشكل ديناميكي لتحديث الحقول المتاحة فقط
        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (title !== undefined) {
            fields.push(`title = $${queryIndex++}`);
            values.push(title);
        }
        if (description !== undefined) {
            fields.push(`description = $${queryIndex++}`);
            values.push(description);
        }
        if (list_id !== undefined) {
            fields.push(`list_id = $${queryIndex++}`);
            values.push(list_id);
        }
        if (order !== undefined) {
            fields.push(`"order" = $${queryIndex++}`);
            values.push(order);
        }
        
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update provided.' });
        }

        const queryString = `UPDATE cards SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;
        values.push(cardId);
        
        const updatedCard = await pool.query(queryString, values);

        res.json(updatedCard.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// ✅ --- DELETE /api/cards/:cardId (جديد) ---
// لحذف بطاقة
router.delete('/cards/:cardId', authMiddleware, async (req, res) => {
    try {
        const { cardId } = req.params;
        await pool.query('DELETE FROM cards WHERE id = $1', [cardId]);
        res.json({ message: 'Card deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

export default router;