import { Search, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { searchUsers as apiSearchUsers } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router';

function ShareModal({
  onClose,
  docName,
}: {
  onClose: () => void;
  docName: string;
}) {
  const [userSearch, setUserSearch] = useState('');
  const [debouncedUserSearch, setDebouncedUserSearch] = useState('');
  const [userResults, setUserResults] = useState<
    {
      id: string;
      username: string;
      email: string;
    }[]
  >([]);
  const [toast, setToast] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const { token } = useAuth();
  const params = useParams();

  async function handleAddCollaborator(userId: string) {
    if (!token) return;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/doc/${params.docId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      },
    );
    return response.ok;
  }

  function confirmNotification(username: string) {
    setToast(`${username} was added successfully`);

    setTimeout(() => {
      setToast('');
    }, 2000);
  }

  async function handleKeyPress(e: any) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (highlightedIndex === userResults.length - 1) {
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((index) => index + 1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (highlightedIndex === 0) {
        setHighlightedIndex(userResults.length - 1);
      } else {
        setHighlightedIndex((index) => index - 1);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (userResults.length === 0) return;
      const user = userResults[highlightedIndex];
      const ok = await handleAddCollaborator(user.id);
      setUserResults([]);
      setUserSearch('');
      if (ok) confirmNotification(user.username);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedUserSearch(userSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [userSearch]);

  useEffect(() => {
    async function searchUsers() {
      if (!token) return;
      if (!params.docId) return;
      if (debouncedUserSearch.length >= 3) {
        const response = await apiSearchUsers(
          token,
          debouncedUserSearch,
          params.docId,
        );
        setUserResults(response.users);
      } else {
        setUserResults([]);
      }
    }
    searchUsers();
  }, [debouncedUserSearch, token, params.docId]);

  useEffect(() => {
    setHighlightedIndex(userResults.length > 0 ? 0 : -1);
  }, [userResults]);

  return (
    <div
      className='fixed inset-0 flex justify-center items-center bg-black/40 z-50'
      onClick={onClose}
    >
      <div
        className='bg-white w-110 rounded-md'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center gap-2 p-5 '>
          <div className='bg-surface-container-low p-2 rounded-lg'>
            <Share2 color='#904822' size={32} />
          </div>

          <div className='flex flex-col'>
            <h2 className='font-serif text-2xl text-[#221a16]'>Share</h2>
            <h3 className='font-sans-serif text-sm text-outline'>
              '{docName}'
            </h3>
          </div>
        </div>
        <div className='px-5'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2
            text-on-surface-variant'
              size={16}
            />
            <div className='flex gap-1'>
              <input
                type='text'
                placeholder='Search by username...'
                className='border border-outline-variant rounded-md w-full pl-9 pr-4 py-2.5'
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button className='bg-primary text-on-primary p-3 rounded-md cursor-pointer '>
                Invite
              </button>
            </div>
            {userResults.length > 0 && (
              <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-[#625B71]/10 rounded-md shadow-xl max-h-48 overflow-y-auto z-10'>
                {userResults.map((user, index) => (
                  <button
                    key={user.id}
                    className={`w-full text-left px-3 py-2 hover:bg-[#625B71]/10 transition-colors ${index === highlightedIndex ? 'bg-[#625B71]/10' : 'hover:bg-[#625B71]/10'}`}
                    onClick={async () => {
                      const ok = await handleAddCollaborator(user.id);
                      setUserResults([]);
                      setUserSearch('');
                      if (ok) confirmNotification(user.username);
                    }}
                  >
                    {user.username}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='bg-[#fff8f6] mt-3 border-t border-outline-variant'>
          <p className='text-outline text-xs tracking-widest uppercase font-semibold'>
            Who can see this
          </p>
          {/* TODO: LIST ALL DOCUMENT MEMBERS HERE. CREATE API FUNCTIONS TO FETCH DOC MEMBERS */}
        </div>
        <div className='flex justify-between items-center gap-3 p-5'>
          <div>
            {toast.length > 0 && (
              <p className='text-xs text-green-400'>{toast}</p>
            )}
          </div>
          <button
            className='flex items-center gap-1 self-start bg-primary text-on-primary p-3 rounded-xl cursor-pointer'
            onClick={onClose}
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
