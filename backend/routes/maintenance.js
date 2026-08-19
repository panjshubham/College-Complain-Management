const { Router } = require('express');
const pool = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

// GET /api/maintenance
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = `
      SELECT mr.*, ct.name AS caretaker_name, ct.phone AS caretaker_phone
      FROM maintenance_requests mr
      LEFT JOIN caretakers ct ON mr.caretaker_id = ct.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' AND mr.user_id = $1';
      params.push(req.user.id);
    }

    query += ' ORDER BY mr.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/maintenance
router.post('/', authMiddleware, async (req, res) => {
  const { title, category, location, description, priority = 'Normal' } = req.body;
  if (!title || !location) return res.status(400).json({ error: 'title and location are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO maintenance_requests (user_id, title, category, location, description, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [req.user.id, title, category || 'Other', location, description || null, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/maintenance/:id — admin
router.patch('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { status, caretaker_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE maintenance_requests SET
        status = COALESCE($1, status),
        caretaker_id = COALESCE($2, caretaker_id),
        updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status || null, caretaker_id || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
