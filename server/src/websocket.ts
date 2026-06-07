import { Server } from '@hocuspocus/server';
import jwt from 'jsonwebtoken';
import * as Y from 'yjs';
import { getDocument, updateDocumentContent } from './db';

const { verify } = jwt;

interface AuthContext {
  userId: string;
  permissions: string[];
}

const server = new Server({
  name: 'test-server',
  port: 1234,
  // timeout: 60000,
  // debounce: 5000,
  // maxDebounce: 30000,
  // quiet: true,
  // websocketOptions: { maxPayload: 1024 * 1024 },
  async onAuthenticate({ token }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) return;
    const payload = jwt.verify(token, secret);
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
  },
});

export default server;
