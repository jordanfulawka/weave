import { useNavigate, useParams } from 'react-router';
import type { Document } from '../lib/types';
import { useDocuments } from '../contexts/DocumentsContext';
import { X, FolderInput } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function DocRow({
  doc,
  isShared,
  inFolder,
}: {
  doc: Document;
  isShared: boolean;
  inFolder: boolean;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { folders, moveDocToFolder } = useDocuments();

  const navigate = useNavigate();
  const { refreshGraph, deleteDocument } = useDocuments();
  const params = useParams();

  const dropdownRef = useRef<HTMLDivElement>(null);

  function detectAwayClick(e: MouseEvent) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsPickerOpen(false);
    }
  }

  useEffect(() => {
    if (!isPickerOpen) return;

    document.addEventListener('click', detectAwayClick);

    return () => document.removeEventListener('click', detectAwayClick);
  }, [isPickerOpen]);

  return (
    <div
      className={`group relative flex justify-between items-center px-3 py-2 mx-1 rounded-md cursor-pointer text-on-surface hover:bg-surface-container ${isShared ? 'border-l-2 border-primary' : ''} ${params.docId === doc.id ? 'bg-surface-container-high text-primary font-medium' : ''} ${inFolder ? 'ml-8' : ''}`}
      key={doc.id}
      onClick={() => {
        navigate(`/doc/${doc.id}`);
        refreshGraph();
      }}
    >
      <div className='truncate'>{doc.title}</div>
      <div className='flex'>
        <span
          className='cursor-pointer'
          title={'Edit Folder'}
          onClick={(e) => {
            e.stopPropagation();
            setIsPickerOpen(true);
          }}
        >
          <FolderInput
            size={16}
            className='mr-1 opacity-0 group-hover:opacity-100'
          />
        </span>
        <span
          className='cursor-pointer'
          title={'Delete Note'}
          onClick={(e) => {
            e.stopPropagation();
            if (
              window.confirm(
                isShared
                  ? `Leave "${doc.title}"? You will no longer have access to this document.`
                  : `Delete "${doc.title}"? This can't be undone.`,
              )
            ) {
              deleteDocument(doc.id);
            }
          }}
        >
          <X size={16} className='mr-1 opacity-0 group-hover:opacity-100' />
        </span>
      </div>
      {isPickerOpen ? (
        <div
          className='absolute right-0 top-full mt-1 bg-surface-container border border-outline-variant rounded-md shadow-lg z-10 min-w-35'
          ref={dropdownRef}
        >
          {folders.map((folder) => (
            <div
              key={folder.id}
              className='px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high cursor-pointer trunacte'
              onClick={(e) => {
                e.stopPropagation();
                moveDocToFolder(doc.id, folder.id);
                setIsPickerOpen(false);
              }}
            >
              {folder.name}
            </div>
          ))}
          {inFolder ? (
            <div
              className='px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high cursor-pointer trunacte'
              onClick={(e) => {
                e.stopPropagation();
                moveDocToFolder(doc.id, null);
                setIsPickerOpen(false);
              }}
            >
              Remove from folder
            </div>
          ) : null}

          {folders.length === 0 && (
            <div className='px-3 py-2 text-sm text-on-surface-variant'>
              No folders yet
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default DocRow;
