import { Plus } from 'lucide-react';
import { createDocument, getDocuments } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState([]);

  const { token, user } = useAuth();

  async function handleCreateNote() {
    try {
      if (!token) {
        setError('no token provided');
        return;
      }
      await createDocument(token, 'hello');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function getRooms() {
    try {
      if (!token) {
        setError('no token!');
        return;
      }
      const response = await getDocuments(token);
      console.log(response);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    console.log(token, user);
    getRooms();
  }, [token]);

  return (
    <div className='bg-surface-container-lowest h-full'>
      <div className='p-3'>
        <h1 className='text-primary font-bold text-xl'>Weave</h1>
      </div>
      <div className='p-3'>
        <button
          type='button'
          className='bg-primary p-3 rounded-md text-white w-full flex items-center justify-center gap-2'
          onClick={handleCreateNote}
        >
          <Plus size={18} strokeWidth={3} />
          New Note
        </button>
      </div>
    </div>
  );
}
