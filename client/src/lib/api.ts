async function login(email: string, password: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function register(email: string, username: string, password: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function createDocument(token: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

async function getDocuments(token: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doc`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

async function getDocumentById(token: string, docId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/doc/${docId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}

async function updateDocumentTitle(
  token: string,
  title: string,
  docId: string,
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/doc/${docId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    },
  );
  return response.json();
}

async function getGraphData(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/doc/graph`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}

async function deleteDocument(token: string, docId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/doc/${docId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}

async function searchUsers(
  token: string,
  query: string,
  excludeDocId?: string,
) {
  const params = new URLSearchParams({ q: query });
  if (excludeDocId) params.set('excludeDocId', excludeDocId);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/search?${params.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}

async function addCollaborator(token: string, docId: string, userId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/doc/${docId}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    },
  );
  return response.json();
}

async function getFolders(token: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/folders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

async function createFolder(token: string, name: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  return response.json();
}

async function renameFolder(token: string, folderId: string, name: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/folders/${folderId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    },
  );
  return response.json();
}

async function deleteFolder(token: string, folderId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/folders/${folderId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}

async function updateDocumentFolder(
  token: string,
  docId: string,
  folder: string | null,
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/doc/${docId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ folder }),
    },
  );
  return response.json();
}

async function getCollaborators(token: string, docId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/doc/${docId}/members`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}

export {
  login,
  register,
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocumentTitle,
  getGraphData,
  deleteDocument,
  searchUsers,
  addCollaborator,
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  updateDocumentFolder,
  getCollaborators,
};
