import { Plus, Search, X } from 'lucide-react';
import type { Document } from '../lib/types';
import { useNavigate, useParams } from 'react-router';
import { useDocuments } from '../contexts/DocumentsContext';
import { useMemo } from 'react';
import DocRow from './DocRow';

export default function Sidebar() {
  const {
    ownedDocs,
    sharedDocs,
    createDocument,
    refreshGraph,
    deleteDocument,
    folders,
  } = useDocuments();
  const navigate = useNavigate();
  const params = useParams();

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
        {/* {ownedDocs.map((doc: Document) => {
          return (
            <div
              className={`group flex justify-between items-center px-3 py-2 mx-1 rounded-md cursor-pointer truncate text-on-surface hover:bg-surface-container ${params.docId === doc.id ? 'bg-surface-container-high text-primary font-medium shadow-sm' : ''}`}
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
                      `Delete "${doc.title}"? This can't be undone.`,
                    )
                  ) {
                    deleteDocument(doc.id);
                  }
                }}
              >
                <X
                  size={16}
                  className='mr-1 opacity-0 group-hover:opacity-100'
                />
              </span>
            </div>
          );
        })} */}
        {folders.map((folder) => (
          <div key={folder.id}>
            <h1>{folder.name}</h1>
            {(byFolder.get(folder.id) ?? []).map((doc) => (
              // <div
              //   className={`group flex justify-between items-center px-3 py-2 mx-1 rounded-md cursor-pointer truncate text-on-surface hover:bg-surface-container ${params.docId === doc.id ? 'bg-surface-container-high text-primary font-medium shadow-sm' : ''}`}
              //   key={doc.id}
              //   onClick={() => {
              //     navigate(`/doc/${doc.id}`);
              //     refreshGraph();
              //   }}
              // >
              //   <div>{doc.title}</div>
              //   <span
              //     className='cursor-pointer'
              //     onClick={(e) => {
              //       e.stopPropagation();
              //       if (
              //         window.confirm(
              //           `Delete "${doc.title}"? This can't be undone.`,
              //         )
              //       ) {
              //         deleteDocument(doc.id);
              //       }
              //     }}
              //   >
              //     <X
              //       size={16}
              //       className='mr-1 opacity-0 group-hover:opacity-100'
              //     />
              //   </span>
              // </div>
              <DocRow doc={doc} isShared={false} />
            ))}
          </div>
        ))}

        <h2>{folders.length > 0 ? 'Ungrouped' : 'Your documents'}</h2>
        {ungrouped.map((doc) => (
          // <div
          //   className={`group flex justify-between items-center px-3 py-2 mx-1 rounded-md cursor-pointer truncate text-on-surface hover:bg-surface-container ${params.docId === doc.id ? 'bg-surface-container-high text-primary font-medium shadow-sm' : ''}`}
          //   key={doc.id}
          //   onClick={() => {
          //     navigate(`/doc/${doc.id}`);
          //     refreshGraph();
          //   }}
          // >
          //   <div>{doc.title}</div>
          //   <span
          //     className='cursor-pointer'
          //     onClick={(e) => {
          //       e.stopPropagation();
          //       if (
          //         window.confirm(`Delete "${doc.title}"? This can't be undone.`)
          //       ) {
          //         deleteDocument(doc.id);
          //       }
          //     }}
          //   >
          //     <X size={16} className='mr-1 opacity-0 group-hover:opacity-100' />
          //   </span>
          // </div>
          <DocRow doc={doc} isShared={false} />
        ))}
        {sharedDocs.length > 0 && (
          <h2 className='text-xs uppercase tracking-widest text-on-surface px-3 mt-4 mb-1'>
            Shared with you
          </h2>
        )}
        {sharedDocs.map((doc: Document) => {
          return (
            // <div
            //   className={`group flex justify-between items-center px-3 py-2 mx-1 rounded-md cursor-pointer truncate text-on-surface hover:bg-surface-container border-l-2 border-primary ${params.docId === doc.id ? 'bg-surface-container-high text-primary font-medium' : ''}`}
            //   key={doc.id}
            //   onClick={() => {
            //     navigate(`/doc/${doc.id}`);
            //     refreshGraph();
            //   }}
            // >
            //   <div>{doc.title}</div>
            //   <span
            //     className='cursor-pointer'
            //     onClick={(e) => {
            //       e.stopPropagation();
            //       if (
            //         window.confirm(
            //           `Leave "${doc.title}"? You will no longer have access to this document.`,
            //         )
            //       ) {
            //         deleteDocument(doc.id);
            //       }
            //     }}
            //   >
            //     <X
            //       size={16}
            //       className='mr-1 opacity-0 group-hover:opacity-100'
            //     />
            //   </span>
            // </div>
            <DocRow doc={doc} isShared={true} />
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
