import { todo } from 'node:test';
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

async function getOwnedDocuments(userId: string) {
  const text =
    'SELECT * FROM documents WHERE owner_id = $1 ORDER BY created_at DESC';
  const values = [userId];

  const result = await pool.query(text, values);
  return result.rows;
}

async function getSharedDocuments(userId: string) {
  const text =
    'SELECT documents.* FROM documents JOIN document_members ON documents.id = document_members.document_id WHERE document_members.user_id = $1 ORDER BY created_at DESC';
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
  const text =
    'SELECT EXISTS(SELECT 1 FROM documents WHERE id = $2 AND owner_id = $1 UNION SELECT 1 FROM document_members WHERE document_id = $2 AND user_id = $1)';
  const values = [userId, docId];

  const result = await pool.query(text, values);
  return result.rows[0].exists;
}

// DOCUMENT LINKS
async function setDocumentLinks(fromDocId: string, toDocIds: string[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM document_links WHERE from_doc_id = $1', [
      fromDocId,
    ]);
    if (toDocIds.length > 0) {
      await client.query(
        'INSERT INTO document_links (from_doc_id, to_doc_id) SELECT $1, unnest($2::uuid[])',
        [fromDocId, toDocIds],
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getDocumentLinks(docId: string) {
  const text =
    'SELECT documents.* FROM document_links JOIN documents ON document_links.to_doc_id = documents.id WHERE document_links.from_doc_id = $1';
  const values = [docId];

  const result = await pool.query(text, values);
  return result.rows;
}

async function getBacklinks(docId: string) {
  const text =
    'SELECT documents.* FROM document_links JOIN documents ON document_links.from_doc_id = documents.id WHERE document_links.to_doc_id = $1';
  const values = [docId];

  const result = await pool.query(text, values);
  return result.rows;
}

async function getGraphData(userId: string) {
  const ownedDocs = await getOwnedDocuments(userId);
  const sharedDocs = await getSharedDocuments(userId);

  const text =
    'SELECT * FROM document_links WHERE from_doc_id = ANY($1::uuid[]) AND to_doc_id = ANY($1::uuid[])';
  const ids = [...ownedDocs, ...sharedDocs].map((doc) => doc.id);
  const values = [ids];
  const edges = await pool.query(text, values);
  const renamedEdges = edges.rows.map((edge) => {
    return {
      source: edge.from_doc_id,
      target: edge.to_doc_id,
    };
  });
  return { nodes: [...ownedDocs, ...sharedDocs], links: renamedEdges };
}

export {
  createUser,
  getUserByEmail,
  getUserByUsername,
  createDocument,
  getDocument,
  getOwnedDocuments,
  getSharedDocuments,
  updateDocumentTitle,
  updateDocumentContent,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
  getDocumentMembers,
  isDocumentMember,
  setDocumentLinks,
  getDocumentLinks,
  getBacklinks,
  getGraphData,
};
