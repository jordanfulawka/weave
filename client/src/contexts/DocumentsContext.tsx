/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react';
import type { Document, Folder } from '../lib/types';
import { useAuth } from './AuthContext';
import {
  getDocuments,
  updateDocumentTitle,
  createDocument as apiCreateDocument,
  deleteDocument as apiDeleteDocument,
  getGraphData,
  getFolders,
  createFolder as apiCreateFolder,
  renameFolder as apiRenameFolder,
  deleteFolder as apiDeleteFolder,
  updateDocumentFolder,
} from '../lib/api';
import { useNavigate } from 'react-router';

interface DocumentsContextType {
  ownedDocs: Document[];
  sharedDocs: Document[];
  renameDocument: (docId: string, newTitle: string) => void;
  createDocument: () => void;
  deleteDocument: (docId: string) => void;
  error: string | null;
  graphData: { nodes: any[]; links: any[] };
  refreshGraph: () => void;
  createFolder: (name: string) => void;
  renameFolder: (folderId: string, name: string) => void;
  deleteFolder: (folderId: string) => void;
  moveDocToFolder: (docId: string, folderId: string | null) => void;
  folders: Folder[];
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
  const [folders, setFolders] = useState<Folder[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

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
    async function fetchFolders() {
      if (!token) return;
      const folders = await getFolders(token);
      setFolders(folders.folders);
    }
    getDocs();
    fetchGraph();
    fetchFolders();
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
    console.log(response.newDoc);
    navigate(`/doc/${response.newDoc.id}`);
    setOwnedDocs((docs) => [response.newDoc, ...docs]);
    return response.newDoc;
  }

  async function deleteDocument(docId: string) {
    if (!token) {
      setError('no token');
      return;
    }
    await apiDeleteDocument(token, docId);
    setOwnedDocs((docs) => docs.filter((doc) => doc.id !== docId));
    setSharedDocs((docs) => docs.filter((doc) => doc.id !== docId));
  }

  async function createFolder(name: string) {
    if (!token) {
      setError('no token');
      return;
    }
    const response = await apiCreateFolder(token, name);
    setFolders((folders) => [response.folder, ...folders]);
  }

  async function renameFolder(folderId: string, name: string) {
    if (!token) {
      setError('no token');
      return;
    }
    await apiRenameFolder(token, folderId, name);
    setFolders((folders) =>
      folders.map((folder) =>
        folder.id === folderId ? { ...folder, name: name } : folder,
      ),
    );
  }

  async function deleteFolder(folderId: string) {
    if (!token) {
      setError('no token');
      return;
    }
    await apiDeleteFolder(token, folderId);
    setFolders((folders) => folders.filter((folder) => folder.id !== folderId));
    setOwnedDocs((docs) =>
      docs.map((doc) =>
        doc.folder_id === folderId ? { ...doc, folder_id: null } : doc,
      ),
    );
  }

  async function moveDocToFolder(docId: string, folderId: string | null) {
    if (!token) {
      setError('no token');
      return;
    }
    const oldDocs = ownedDocs;
    try {
      setOwnedDocs((docs) =>
        docs.map((doc) =>
          doc.id === docId ? { ...doc, folder_id: folderId } : doc,
        ),
      );
      await updateDocumentFolder(token, docId, folderId);
    } catch {
      setOwnedDocs(oldDocs);
    }
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
        deleteDocument,
        folders,
        createFolder,
        renameFolder,
        deleteFolder,
        moveDocToFolder,
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
