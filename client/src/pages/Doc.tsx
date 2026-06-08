import { useParams } from 'react-router';
import Editor from '../components/Editor';
import { useAuth } from '../contexts/AuthContext';
import { HocuspocusRoom } from '@hocuspocus/provider-react';
import { useEffect, useRef, useState } from 'react';
import { getDocumentById } from '../lib/api';
import { useDocuments } from '../contexts/DocumentsContext';

export default function Doc() {
  const [title, setTitle] = useState('Loading...');
  const { token } = useAuth();
  const params = useParams();
  const { ownedDocs, sharedDocs, renameDocument } = useDocuments();
  const savedTitleRef = useRef('');

  const currentDoc = [...ownedDocs, ...sharedDocs].find(
    (doc) => doc.id === params.docId,
  );

  useEffect(() => {
    if (currentDoc) {
      setTitle(currentDoc.title);
      savedTitleRef.current = currentDoc.title;
    }
  }, [params.docId]);

  useEffect(() => {
    if (title === savedTitleRef.current) return;
    const timer = setTimeout(() => {
      if (!params.docId) return null;
      renameDocument(params.docId, title);
      console.log('title changed');
    }, 500);

    return () => clearTimeout(timer);
  }, [title, renameDocument]);

  if (!params.docId) return null;
  if (!token) return null;

  return (
    <div className='flex flex-col h-full p-10'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='text-2xl font-semibold text-on-surface
  bg-transparent border-none outline-none rounded-md
  px-2 py-1 focus:bg-surface-container focus:ring-2
  focus:ring-primary mb-1'
      />
      <HocuspocusRoom name={params.docId} token={token}>
        <Editor />
      </HocuspocusRoom>
    </div>
  );
}
