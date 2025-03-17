const pool = require('../config/db');

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL!');
    
    // Test query to get users
    const result = await client.query('SELECT * FROM users LIMIT 1');
    console.log('Sample user data:', result.rows[0]);
    
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

testConnection();
