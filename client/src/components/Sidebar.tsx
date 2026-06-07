import { Plus } from 'lucide-react';

export default function Sidebar() {

  function handleCreateNote() {
    const newNote = 
  }

  return (
    <div className='bg-surface-container-lowest h-full'>
      <div className='p-3'>
        <h1 className='text-primary font-bold text-xl'>Weave</h1>
      </div>
      <div className='p-3'>
        <button
          type='button'
          className='bg-primary p-3 rounded-md text-white w-full flex items-center justify-center gap-2'
        >
          <Plus size={18} strokeWidth={3} />
          New Note
        </button>
      </div>
    </div>
  );
}
