import { Server } from '@hocuspocus/server';
import jwt from 'jsonwebtoken';
import * as Y from 'yjs';
import {
  getDocument,
  isDocumentMember,
  setDocumentLinks,
  updateDocumentContent,
} from './db';

const { verify } = jwt;

interface AuthContext {
  userId: string;
  permissions: string[];
}

function collectWikiLinkIds(fragment: Y.XmlFragment, documentName: string) {
  const ids = new Set<string>();

  function walk(node: Y.XmlFragment | Y.XmlElement | Y.XmlText | Y.XmlHook) {
    if (node instanceof Y.XmlElement) {
      if (node.nodeName === 'wikilink') {
        const documentId = node.getAttribute('documentId');
        if (documentId && documentId !== documentName) {
          ids.add(documentId);
        }
      }
    }
    if (node instanceof Y.XmlFragment || node instanceof Y.XmlElement) {
      for (const child of node.toArray()) {
        walk(child);
      }
    }
  }
  walk(fragment);
  return Array.from(ids);
}

const server = new Server({
  name: 'test-server',
  port: 1234,
  // timeout: 60000,
  // debounce: 5000,
  // maxDebounce: 30000,
  // quiet: true,
  // websocketOptions: { maxPayload: 1024 * 1024 },
  async onAuthenticate({ token, documentName }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) return;
    const payload = jwt.verify(token, secret);
    const userId = (payload as any).id;

    if (!(await isDocumentMember(documentName, userId))) {
      throw new Error('Not authorized for this document');
    }
    return { user: payload, permission: ['read', 'write'] };
  },
  async onLoadDocument({ documentName }) {
    const row = await getDocument(documentName);
    const ydoc = new Y.Doc();
    if (row?.content) {
      Y.applyUpdate(ydoc, row.content);
    }
    return ydoc;
  },
  async onStoreDocument({ documentName, document }) {
    const update = Y.encodeStateAsUpdate(document);
    await updateDocumentContent(documentName, Buffer.from(update));

    const fragment = document.getXmlFragment('default');
    console.log('helllllooo');
    await setDocumentLinks(
      documentName,
      collectWikiLinkIds(fragment, documentName),
    );
  },
});

export default server;
