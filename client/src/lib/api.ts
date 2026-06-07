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
  return response.json();
}

async function createDocument(token: string, title?: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
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
  console.log(response);
  return response.json();
}

export { login, register, createDocument, getDocuments };
