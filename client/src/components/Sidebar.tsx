import { Plus, Search } from 'lucide-react';
import { createDocument } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import type { Document } from '../lib/types';
import { useNavigate, useParams } from 'react-router';
import { useDocuments } from '../contexts/DocumentsContext';

export default function Sidebar() {
  const [error, setError] = useState<string | null>(null);

  const { ownedDocs, sharedDocs } = useDocuments();
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

  return (
    <div className='bg-surface-container-lowest h-full shadow-xl flex flex-col'>
      <div className='p-3'>
        <h1 className='text-primary font-bold text-xl'>Weave</h1>
      </div>
      <div className='flex justify-center'>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2
  text-on-surface-variant'
            size={16}
          />
          <input
            type='text'
            placeholder='Search...'
            className='w-full pl-9 pr-3 py-2 rounded-md border
  border-outline-variant bg-surface-container text-on-surface
  placeholder:text-on-surface-variant focus:outline-none focus:ring-2
  focus:ring-primary'
          />
        </div>
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
