import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// --- GET /api/boards/:boardId/lists ---
// جلب كل القوائم (مع البطاقات بداخلها) للوحة معينة
router.get('/boards/:boardId/lists', authMiddleware, async (req, res) => {
  try {
    const { boardId } = req.params;

    // جلب القوائم المرتبة
    const listsResult = await pool.query(
      'SELECT * FROM lists WHERE board_id = $1 ORDER BY "order" ASC',
      [boardId]
    );
    const lists = listsResult.rows;

    // جلب كل البطاقات في هذه اللوحة مرة واحدة لتحسين الأداء
    const cardsResult = await pool.query(
      'SELECT cards.* FROM cards JOIN lists ON cards.list_id = lists.id WHERE lists.board_id = $1',
      [boardId]
    );
    const cards = cardsResult.rows;

    // دمج البطاقات داخل القوائم الخاصة بها
    const listsWithCards = lists.map(list => ({
      ...list,
      cards: cards.filter(card => card.list_id === list.id).sort((a, b) => a.order - b.order),
    }));

    res.json(listsWithCards);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


// --- POST /api/lists ---
// إنشاء قائمة جديدة
router.post('/lists', authMiddleware, async (req, res) => {
    try {
      const { title, board_id, order } = req.body;
      const newList = await pool.query(
        'INSERT INTO lists (title, board_id, "order") VALUES ($1, $2, $3) RETURNING *',
        [title, board_id, order]
      );
      res.status(201).json(newList.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
});


export default router;