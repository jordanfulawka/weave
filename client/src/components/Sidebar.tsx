import { Plus } from 'lucide-react';
import { createDocument, getDocuments } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { Document } from '../lib/types';
import { useNavigate, useParams } from 'react-router';

export default function Sidebar() {
  const [error, setError] = useState<string | null>(null);
  const [ownedDocs, setOwnedDocs] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);

  const { token } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

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

  useEffect(() => {
    async function getDocs() {
      try {
        if (!token) {
          setError('no token!');
          return;
        }
        const response = await getDocuments(token);
        setOwnedDocs(response.ownedDocs);
        setSharedDocs(response.sharedDocs);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    getDocs();
  }, [token]);

  return (
    <div className='bg-surface-container-lowest h-full shadow-xl flex flex-col'>
      <div className='p-3'>
        <h1 className='text-primary font-bold text-xl'>Weave</h1>
      </div>
      <div className='flex justify-center'>
        <input
          type='text'
          className='border border-outline-variant rounded-md py-2 bg-[#FFEDE6]'
        />
      </div>
      <div className='overflow-y-scroll'>
        <h2 className='text-xs uppercase tracking-widest text-on-surface px-3 mt-4 mb-1'>
          Your documents
        </h2>
        {ownedDocs.map((doc: Document) => {
          return (
            <div
              key={doc.id}
              onClick={() => navigate(`/doc/${doc.id}`)}
              className={`px-3 py-2 mx-1 rounded-md cursor-pointer truncate text-on-surface hover:bg-surface-container ${params.docId === doc.id ? 'bg-surface-container-high text-primary font-medium' : ''}`}
            >
              {doc.title}
            </div>
          );
        })}
        {sharedDocs.length > 0 && (
          <h2 className='text-xs uppercase tracking-widest text-on-surface px-3 mt-4 mb-1'>
            Your documents
          </h2>
        )}
        {sharedDocs.map((doc: Document) => {
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
      <div>{error ? error : ''}</div>
    </div>
  );
}
