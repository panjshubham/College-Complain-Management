import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/complaints - student: own complaints, admin: all
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, category_id, search, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT c.*, cat.name AS category_name, u.full_name AS student_name
      FROM complaints c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (req.user.role !== 'admin') {
      query += ` AND c.user_id = $${paramIdx++}`;
      params.push(req.user.id);
    }

    if (status) {
      query += ` AND c.status = $${paramIdx++}`;
      params.push(status);
    }
    if (category_id) {
      query += ` AND c.category_id = $${paramIdx++}`;
      params.push(category_id);
    }
    if (search) {
      query += ` AND (c.title ILIKE $${paramIdx} OR c.description ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/complaints/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, cat.name AS category_name, u.full_name AS student_name,
              ct.name AS caretaker_name, ct.phone AS caretaker_phone
       FROM complaints c
       LEFT JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN caretakers ct ON c.caretaker_id = ct.id
       WHERE c.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Complaint not found.' });

    const complaint = result.rows[0];
    if (req.user.role !== 'admin' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    // Fetch timeline events
    const timeline = await pool.query(
      'SELECT * FROM complaint_events WHERE complaint_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );

    res.json({ ...complaint, timeline: timeline.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/complaints
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, category_id, location, urgency = 'normal' } = req.body;

  if (!title || !description || !category_id) {
    return res.status(400).json({ error: 'title, description and category_id are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO complaints (user_id, title, description, category_id, location, urgency, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'open') RETURNING *`,
      [req.user.id, title, description, category_id, location || null, urgency]
    );
    const complaint = result.rows[0];

    // Create initial timeline event
    await pool.query(
      `INSERT INTO complaint_events (complaint_id, status, note, created_by)
       VALUES ($1, 'open', 'Complaint submitted successfully.', $2)`,
      [complaint.id, req.user.id]
    );

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/complaints/:id — admin updates status/caretaker
router.patch('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { status, caretaker_id, admin_note } = req.body;

  try {
    const result = await pool.query(
      `UPDATE complaints SET
        status = COALESCE($1, status),
        caretaker_id = COALESCE($2, caretaker_id),
        updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status || null, caretaker_id || null, req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Complaint not found.' });

    // Add timeline event
    if (status || admin_note) {
      await pool.query(
        `INSERT INTO complaint_events (complaint_id, status, note, created_by)
         VALUES ($1, $2, $3, $4)`,
        [req.params.id, status || result.rows[0].status, admin_note || `Status updated to ${status}.`, req.user.id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/complaints/:id/feedback — student submits resolution feedback
router.post('/:id/feedback', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const result = await pool.query(
      `UPDATE complaints SET rating = $1, feedback_comment = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [rating, comment || null, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Complaint not found or unauthorized.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
