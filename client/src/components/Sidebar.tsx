import { ChevronRight, Folder, Plus, Search, X } from 'lucide-react';
import type { Document } from '../lib/types';
import { useDocuments } from '../contexts/DocumentsContext';
import { useMemo, useState } from 'react';
import DocRow from './DocRow';

export default function Sidebar() {
  const {
    ownedDocs,
    sharedDocs,
    createDocument,
    folders,
    createFolder,
    // renameFolder,
    deleteFolder,
    // moveDocToFolder,
  } = useDocuments();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  function toggleFolder(folderId: string) {
    setExpandedFolders((expandedFolders) => {
      const next = new Set(expandedFolders);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }

  function handleCreateFolder() {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
    }
    setIsCreatingFolder(false);
    setNewFolderName('');
  }

  function cancelCreateFolder() {
    setIsCreatingFolder(false);
    setNewFolderName('');
  }

  const { byFolder, ungrouped } = useMemo(() => {
    const byFolder = new Map<string, Document[]>();
    const ungrouped: Document[] = [];

    for (const doc of ownedDocs) {
      const folderExists =
        doc.folder_id !== null &&
        folders.some((folder) => folder.id === doc.folder_id);

      if (folderExists) {
        const existing = byFolder.get(doc.folder_id as string) ?? [];
        existing.push(doc);
        byFolder.set(doc.folder_id as string, existing);
      } else {
        ungrouped.push(doc);
      }
    }

    return { byFolder, ungrouped };
  }, [folders, ownedDocs]);

  return (
    <div className='bg-surface-container-lowest h-full shadow-xl flex flex-col'>
      <div className='p-3 flex justify-between items-center'>
        <h1 className='text-primary font-bold text-xl'>Weave</h1>
        <h1 className='tracking-widest bg-surface-container text-on-surface-variant text-xs p-1 rounded-md'>
          BETA
        </h1>
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
      <div className='overflow-y-auto flex-1'>
        <h2 className='text-xs uppercase tracking-widest text-on-surface px-3 mt-4 mb-1'>
          Your documents
        </h2>
        {isCreatingFolder ? (
          <input
            type='text'
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
              if (e.key === 'Escape') cancelCreateFolder();
            }}
            onBlur={cancelCreateFolder}
            className='w-[90%] px-3 py-1 my-1.25 mx-1 rounded-md border border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary text-sm'
          />
        ) : (
          <button
            onClick={() => setIsCreatingFolder(true)}
            className='flex items-center gap-2 px-3 py-2 w-full text-left text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-md'
          >
            <Plus size={14} />
            New folder
          </button>
        )}
        {folders.map((folder) => (
          <div key={folder.id} className='mb-1'>
            <div
              className='group flex items-center gap-2 px-3 py-2 cursor-pointer'
              onClick={() => toggleFolder(folder.id)}
            >
              <ChevronRight
                size={14}
                className={`transition-transform ${expandedFolders.has(folder.id) ? 'rotate-90' : ''}`}
              />
              <Folder size={16} />
              <span>{folder.name}</span>
              <span
                className='cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      `Delete "${folder.name}"? Document inside will be unfiled.`,
                    )
                  ) {
                    deleteFolder(folder.id);
                  }
                }}
              >
                <X
                  size={16}
                  className='mr-1 opacity-0 group-hover:opacity-100'
                />
              </span>
            </div>
            {expandedFolders.has(folder.id)
              ? (byFolder.get(folder.id) ?? []).map((doc) => (
                  <DocRow
                    doc={doc}
                    isShared={false}
                    key={doc.id}
                    inFolder={true}
                  />
                ))
              : null}
          </div>
        ))}

        {ungrouped.map((doc) => (
          <DocRow doc={doc} isShared={false} key={doc.id} inFolder={false} />
        ))}
        {sharedDocs.length > 0 && (
          <h2 className='text-xs uppercase tracking-widest text-on-surface px-3 mt-4 mb-1'>
            Shared with you
          </h2>
        )}
        {sharedDocs.map((doc: Document) => {
          return (
            <DocRow doc={doc} isShared={true} key={doc.id} inFolder={false} />
          );
        })}
      </div>
      <div className='p-3'>
        <button
          type='button'
          className='bg-primary p-3 rounded-md text-white w-full flex items-center justify-center gap-2'
          onClick={createDocument}
        >
          <Plus size={18} strokeWidth={3} />
          New Note
        </button>
      </div>
    </div>
  );
}
