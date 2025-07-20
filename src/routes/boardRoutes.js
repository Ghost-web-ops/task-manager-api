import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ✅ --- GET /api/boards (Corrected) ---
// Fetches all boards for the current user
router.get('/boards', authMiddleware, async (req, res) => {
  try {
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

// --- GET /api/boards/:boardId ---
// Fetches a single specific board
router.get('/boards/:boardId', authMiddleware, async (req, res) => {
    try {
      const { boardId } = req.params;
      const boardResult = await pool.query(
        'SELECT * FROM boards WHERE id = $1 AND user_id = $2',
        [boardId, req.user.id]
      );
      if (boardResult.rows.length === 0) {
        return res.status(404).json({ error: 'Board not found or user not authorized.' });
      }
      res.json(boardResult.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
});


// --- POST /api/boards ---
// Creates a new board
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

// --- PATCH /api/boards/:boardId ---
// Updates a board's title
router.patch('/boards/:boardId', authMiddleware, async (req, res) => {
    try {
        const { boardId } = req.params;
        const { title } = req.body;
        const updatedBoard = await pool.query(
            'UPDATE boards SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [title, boardId, req.user.id]
        );
        if (updatedBoard.rows.length === 0) {
            return res.status(404).json({ error: 'Board not found or user not authorized.' });
        }
        res.json(updatedBoard.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// --- DELETE /api/boards/:boardId ---
// Deletes a board
router.delete('/boards/:boardId', authMiddleware, async (req, res) => {
    try {
      const { boardId } = req.params;
      const deleteResult = await pool.query(
        'DELETE FROM boards WHERE id = $1 AND user_id = $2',
        [boardId, req.user.id]
      );
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'Board not found or user not authorized.' });
      }
      res.json({ message: 'Board deleted successfully.' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
});


export default router;