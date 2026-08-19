const { Router } = require('express');
const pool = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

// GET /api/caretakers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM caretakers ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/caretakers — admin only
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { name, phone, email, specialization, department } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required.' });

  try {
    const result = await pool.query(
      `INSERT INTO caretakers (name, phone, email, specialization, department)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, phone || null, email || null, specialization || null, department || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/caretakers/:id — admin only
router.patch('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { name, phone, email, specialization, department } = req.body;

  try {
    const result = await pool.query(
      `UPDATE caretakers SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        email = COALESCE($3, email),
        specialization = COALESCE($4, specialization),
        department = COALESCE($5, department),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [name || null, phone || null, email || null, specialization || null, department || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Caretaker not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/caretakers/:id — admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM caretakers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Caretaker deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
