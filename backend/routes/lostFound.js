import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/lost-found
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = `
      SELECT lf.*, u.full_name AS reporter_name
      FROM lost_found_items lf
      LEFT JOIN users u ON lf.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (type) { query += ` AND lf.type = $${idx++}`; params.push(type); }
    if (status) { query += ` AND lf.status = $${idx++}`; params.push(status); }

    query += ' ORDER BY lf.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/lost-found
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, type, location, contact } = req.body;
  if (!title || !type) return res.status(400).json({ error: 'title and type are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO lost_found_items (user_id, title, description, type, location, contact, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'open') RETURNING *`,
      [req.user.id, title, description || null, type, location || null, contact || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/lost-found/:id/status — admin only
router.patch('/:id/status', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status is required.' });

  try {
    const result = await pool.query(
      `UPDATE lost_found_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
