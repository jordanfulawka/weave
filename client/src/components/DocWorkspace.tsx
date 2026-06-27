import { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import ShareModal from './ShareModal';
import { Share } from 'lucide-react';
import { useParams } from 'react-router';
import { useDocuments } from '../contexts/DocumentsContext';
import { useHocuspocusAwareness } from '@hocuspocus/provider-react';

function DocWorkspace() {
  const [title, setTitle] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const savedTitleRef = useRef('');

  const params = useParams();
  const { ownedDocs, sharedDocs, renameDocument } = useDocuments();

  const users = useHocuspocusAwareness();

  const currentDoc = [...ownedDocs, ...sharedDocs].find(
    (doc) => doc.id === params.docId,
  );

  const isOwned = ownedDocs.find((doc) => params.docId === doc.id);

  useEffect(() => {
    if (currentDoc) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(currentDoc.title);
      savedTitleRef.current = currentDoc.title;
    }
  }, [currentDoc]);

  useEffect(() => {
    if (title === savedTitleRef.current) return;
    const timer = setTimeout(() => {
      if (!params.docId) return null;
      renameDocument(params.docId, title);
    }, 500);

    return () => clearTimeout(timer);
  }, [title, params.docId, renameDocument]);

  if (!params.docId) return null;

  return (
    <div className='flex flex-col h-full p-10 overflow-y-auto'>
      <div className='flex justify-between'>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-2xl font-semibold text-on-surface
        bg-transparent border-none outline-none rounded-md
        px-2 py-1 focus:bg-surface-container focus:ring-2
        focus:ring-primary mb-1'
        />
        {isShareModalOpen && currentDoc && (
          <ShareModal
            onClose={() => setIsShareModalOpen(false)}
            docName={currentDoc.title}
          />
        )}
        <button
          disabled={!isOwned}
          title={isOwned ? undefined : 'Only the owner can share this document'}
          className={
            isOwned
              ? 'flex items-center gap-1 text-sm self-start bg-primary text-on-primary p-3 rounded-xl shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200'
              : 'flex items-center gap-1 text-sm self-start bg-surface-container text-on-surface-variant p-3 rounded-xl cursor-not-allowed transition-all duration-200'
          }
          onClick={() => setIsShareModalOpen(true)}
        >
          <span>Share</span> <Share size={16} />
        </button>
      </div>
      <div className='flex gap-1'>
        {users.map((user: any) => {
          return (
            <div className='flex items-center'>
              <p className='px-2 text-on-surface-variant text-sm'>Online: </p>
              <div
                className='rounded-full w-7 h-7 flex justify-center items-center text-white cursor-pointer'
                style={{ backgroundColor: `${user?.user?.color}` }}
                title={user?.user?.name}
              >
                {user?.user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
      <Editor />
    </div>
  );
}

export default DocWorkspace;
