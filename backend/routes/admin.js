const { Router } = require('express');
const pool = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = Router();

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// GET /api/admin/stats
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    // 1. Basic Counts
    const countsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_complaints,
        COUNT(*) FILTER (WHERE status = 'open') as pending_count,
        COUNT(*) FILTER (WHERE status = 'in-progress' OR status = 'assigned' OR status = 'review') as in_progress_count,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count
      FROM complaints
    `);
    const counts = countsResult.rows[0];

    // 2. Category Breakdown
    const categoryResult = await pool.query(`
      SELECT cat.name, COUNT(c.id) as value
      FROM categories cat
      LEFT JOIN complaints c ON c.category_id = cat.id
      GROUP BY cat.name
    `);
    
    // 3. Department/Location Breakdown (mocking it from locations for now)
    const deptResult = await pool.query(`
      SELECT COALESCE(location, 'Unspecified') as name,
             COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
             COUNT(*) FILTER (WHERE status != 'resolved') as pending
      FROM complaints
      GROUP BY location
      ORDER BY COUNT(*) DESC
      LIMIT 5
    `);

    // 4. Avg Resolution Time (in hours)
    const avgTimeResult = await pool.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_hours
      FROM complaints
      WHERE status = 'resolved'
    `);
    
    // 5. Trend (7 days)
    const trendResult = await pool.query(`
      SELECT to_char(created_at, 'Dy') as name, COUNT(*) as count
      FROM complaints
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY to_char(created_at, 'Dy'), DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    res.json({
      total: parseInt(counts.total_complaints) || 0,
      pending: parseInt(counts.pending_count) || 0,
      inProgress: parseInt(counts.in_progress_count) || 0,
      resolved: parseInt(counts.resolved_count) || 0,
      avgResolutionTime: parseFloat(avgTimeResult.rows[0]?.avg_hours || 0).toFixed(1),
      byCategory: categoryResult.rows.map(r => ({ name: r.name, value: parseInt(r.value) })),
      byDepartment: deptResult.rows.map(r => ({ name: r.name, resolved: parseInt(r.resolved), pending: parseInt(r.pending) })),
      trend: trendResult.rows.map(r => ({ name: r.name, count: parseInt(r.count) }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching stats.' });
  }
});

// PATCH /api/admin/complaints/:id/status
router.patch('/complaints/:id/status', authMiddleware, adminOnly, async (req, res) => {
  const { status, caretaker_id, admin_note } = req.body;
  const complaintId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE complaints SET
        status = COALESCE($1, status),
        caretaker_id = COALESCE($2, caretaker_id),
        updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status || null, caretaker_id || null, complaintId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Complaint not found.' });
    
    const complaint = result.rows[0];

    // Fetch user details for email
    const userResult = await pool.query('SELECT full_name, email FROM users WHERE id = $1', [complaint.user_id]);
    const user = userResult.rows[0];

    if (status || admin_note) {
      await pool.query(
        `INSERT INTO complaint_events (complaint_id, status, note, created_by)
         VALUES ($1, $2, $3, $4)`,
        [complaintId, status || complaint.status, admin_note || \`Status updated to \${status}.\`, req.user.id]
      );
    }

    // Try to send email (fails gracefully if no SMTP config)
    if (process.env.SMTP_HOST && user && user.email) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: user.email,
          subject: \`Update on your complaint: \${complaint.title}\`,
          text: \`Hello \${user.full_name},\\n\\nYour complaint status has been updated to: \${status || complaint.status}.\\n\\nAdmin Note: \${admin_note || 'No additional note provided.'}\\n\\nRegards,\\nAdmin Team\`
        });
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr.message);
      }
    }

    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating status.' });
  }
});

module.exports = router;
