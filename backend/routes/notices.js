const { Router } = require('express');
const pool = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

// GET /api/notices
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/notices — admin only
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { title, body, priority = 'General' } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO notices (title, body, priority, posted_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, body, priority, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/notices/:id — admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM notices WHERE id = $1', [req.params.id]);
    res.json({ message: 'Notice deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
