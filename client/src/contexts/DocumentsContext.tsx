import { createContext, useContext, useEffect, useState } from 'react';
import type { Document } from '../lib/types';
import { useAuth } from './AuthContext';
import {
  getDocuments,
  updateDocumentTitle,
  createDocument as apiCreateDocument,
} from '../lib/api';

interface DocumentsContextType {
  ownedDocs: Document[];
  sharedDocs: Document[];
  renameDocument: (docId: string, newTitle: string) => void;
  createDocument: () => void;
  error: string | null;
}

const DocumentsContext = createContext<DocumentsContextType | null>(null);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [ownedDocs, setOwnedDocs] = useState<Document[]>([]);
  const [sharedDocs, setSharedDocs] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

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

  async function renameDocument(docId: string, newTitle: string) {
    try {
      if (!token) {
        setError('no token!');
        return;
      }
      const oldOwnedDocs = ownedDocs;
      const oldSharedDocs = sharedDocs;
      setOwnedDocs((docs) =>
        docs.map((doc) =>
          doc.id === docId ? { ...doc, title: newTitle } : doc,
        ),
      );
      setSharedDocs((docs) =>
        docs.map((doc) =>
          doc.id === docId ? { ...doc, title: newTitle } : doc,
        ),
      );
      const response = await updateDocumentTitle(token, newTitle, docId);
      if (!response.ok) {
        setOwnedDocs(oldOwnedDocs);
        setSharedDocs(oldSharedDocs);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createDocument() {
    if (!token) {
      setError('no token');
      return;
    }
    const response = await apiCreateDocument(token);
    setOwnedDocs((docs) => [...docs, response.newDoc]);
    return response.newDoc;
  }

  return (
    <DocumentsContext.Provider
      value={{ ownedDocs, sharedDocs, renameDocument, error, createDocument }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used within the DocumentsProvider');
  }
  return context;
}
