import { Server } from '@hocuspocus/server';
import jwt from 'jsonwebtoken';

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
});

export default server;
