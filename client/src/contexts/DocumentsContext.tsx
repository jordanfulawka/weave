import { createContext, useContext, useEffect, useState } from 'react';
import type { Document } from '../lib/types';
import { useAuth } from './AuthContext';
import {
  getDocuments,
  updateDocumentTitle,
  createDocument as apiCreateDocument,
  getGraphData,
} from '../lib/api';

interface DocumentsContextType {
  ownedDocs: Document[];
  sharedDocs: Document[];
  renameDocument: (docId: string, newTitle: string) => void;
  createDocument: () => void;
  error: string | null;
  graphData: { nodes: any[]; links: any[] };
  refreshGraph: () => void;
}

const DocumentsContext = createContext<DocumentsContextType | null>(null);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [ownedDocs, setOwnedDocs] = useState<Document[]>([]);
  const [sharedDocs, setSharedDocs] = useState<Document[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });
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
    async function fetchGraph() {
      if (!token) return;
      const apiGraphData = await getGraphData(token);
      setGraphData(apiGraphData);
    }
    getDocs();
    fetchGraph();
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
    setOwnedDocs((docs) => [response.newDoc, ...docs]);
    return response.newDoc;
  }

  async function refreshGraph() {
    if (!token) return;
    const apiGraphData = await getGraphData(token);
    setGraphData(apiGraphData);
  }

  return (
    <DocumentsContext.Provider
      value={{
        ownedDocs,
        sharedDocs,
        renameDocument,
        error,
        createDocument,
        graphData,
        refreshGraph,
      }}
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
