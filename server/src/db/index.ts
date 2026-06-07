import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// USERS
async function createUser(
  email: string,
  username: string,
  passwordHash: string,
) {
  const text =
    'INSERT INTO users (email, username, password_hash) VALUES($1, $2, $3) RETURNING *';
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

// DOCUMENTS
async function createDocument(ownerId: string) {
  const text = 'INSERT INTO documents(owner_id) VALUES($1) RETURNING *';
  const values = [ownerId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getDocument(docId: string) {
  const text = 'SELECT * FROM documents WHERE id = $1';
  const values = [docId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getUserDocuments(userId: string) {
  const text =
    'SELECT * FROM documents WHERE owner_id = $1 UNION SELECT documents.* FROM documents JOIN document_members ON documents.id = document_members.document_id WHERE document_members.user_id = $1 ORDER BY created_at DESC';
  const values = [userId];

  const result = await pool.query(text, values);
  return result.rows;
}

async function updateDocumentTitle(docId: string, title: string) {
  const text = 'UPDATE documents SET title = $1 WHERE id = $2 RETURNING *';
  const values = [title, docId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function updateDocumentContent(docId: string, content: Buffer) {
  const text = 'UPDATE documents SET content = $1 WHERE id = $2 RETURNING *';
  const values = [content, docId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function deleteDocument(docId: string) {
  const text = 'DELETE FROM documents WHERE doc_id = $1';
  const values = [docId];

  await pool.query(text, values);
}

// COLLABORATORS
async function addCollaborator(docId: string, userId: string) {
  const text =
    'INSERT INTO document_members(document_id, user_id) VALUES($1, $2) RETURNING *';
  const values = [docId, userId];

  await pool.query(text, values);
}

async function removeCollaborator(docId: string, userId: string) {
  const text =
    'DELETE from document_members WHERE document_id = $1 AND user_id = $2';
  const values = [docId, userId];

  await pool.query(text, values);
}

async function getDocumentMembers(docId: string) {
  const text = 'SELECT * FROM document_members WHERE document_id = $1';
  const values = [docId];

  const result = await pool.query(text, values);
  return result.rows;
}

async function isDocumentMember(docId: string, userId: string) {
  // some sort of boolean function here
}

// DOCUMENT LINKS
async function getDocumentLinks(fromDocId: string, toDocIds: string[]) {}

async function getBacklinks(docId: string) {}

export {
  createUser,
  getUserByEmail,
  getUserByUsername,
  createDocument,
  getDocument,
  getUserDocuments,
  updateDocumentTitle,
  updateDocumentContent,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
  getDocumentMembers,
};
