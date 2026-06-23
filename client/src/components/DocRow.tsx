import { useNavigate, useParams } from 'react-router';
import type { Document } from '../lib/types';
import { useDocuments } from '../contexts/DocumentsContext';
import { X } from 'lucide-react';

function DocRow({ doc, isShared }: { doc: Document; isShared: boolean }) {
  const navigate = useNavigate();
  const { refreshGraph, deleteDocument } = useDocuments();
  const params = useParams();

  return (
    <div
      className={`group flex justify-between items-center px-3 py-2 mx-1 rounded-md cursor-pointer truncate text-on-surface hover:bg-surface-container ${isShared ? 'border-l-2 border-primary' : ''} ${params.docId === doc.id ? 'bg-surface-container-high text-primary font-medium' : ''}`}
      key={doc.id}
      onClick={() => {
        navigate(`/doc/${doc.id}`);
        refreshGraph();
      }}
    >
      <div>{doc.title}</div>
      <span
        className='cursor-pointer'
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
  );
}

export default DocRow;
