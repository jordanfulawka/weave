import { Plus } from 'lucide-react';
import { createDocument, getDocuments } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { Document } from '../lib/types';
import { useNavigate } from 'react-router';

export default function Sidebar() {
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState([]);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  async function handleCreateDocument() {
    try {
      if (!token) {
        setError('no token provided');
        return;
      }
      const response = await createDocument(token);
      console.log(response);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function getDocs() {
    try {
      if (!token) {
        setError('no token!');
        return;
      }
      const response = await getDocuments(token);
      setDocs(response.docs);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    console.log(token, user);
    getDocs();
  }, [token]);

  return (
    <div className='bg-surface-container-lowest h-full'>
      <div className='p-3'>
        <h1 className='text-primary font-bold text-xl'>Weave</h1>
      </div>
      <div>
        {docs.map((doc: Document) => {
          return (
            <div key={doc.id} onClick={() => navigate(`/doc/${doc.id}`)}>
              {doc.title}
            </div>
          );
        })}
      </div>
      <div className='p-3'>
        <button
          type='button'
          className='bg-primary p-3 rounded-md text-white w-full flex items-center justify-center gap-2'
          onClick={handleCreateDocument}
        >
          <Plus size={18} strokeWidth={3} />
          New Note
        </button>
      </div>
    </div>
  );
}
