const { Router } = require('express');
const pool = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

// GET /api/events
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (type && type !== 'All') {
      query += ' AND type = $1';
      params.push(type);
    }

    query += ' ORDER BY event_date ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/events — admin only
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { title, description, type, venue, event_date, organizer } = req.body;
  if (!title || !event_date) return res.status(400).json({ error: 'title and event_date are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO events (title, description, type, venue, event_date, organizer)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description || null, type || 'General', venue || null, event_date, organizer || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/events/:id — admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
