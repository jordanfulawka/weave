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

async function createNote(ownerId: string, title?: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/`);
}

export { login, register };
