const pool = require('pg').Pool;

const db = new pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = db;
