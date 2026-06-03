import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createUser(
  email: string,
  username: string,
  passwordHash: string,
) {
  const text =
    'INSERT INTO users (email, username, password_hash) VALUES($1, $2, $3)';
  const values = [email, username, passwordHash];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getUserByEmail(email: string) {
  const text = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getUserByUsername(username: string) {
  const text = 'SELECT * FROM users WHERE username = $1';
  const values = [username];

  const result = await pool.query(text, values);
  return result.rows[0];
}
