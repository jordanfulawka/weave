import 'dotenv/config';
import { createServer } from 'http';
import crossws from 'crossws/adapters/node';
import app from './server';
import hocuspocus from './websocket';

const PORT = process.env.PORT || 3001;

const server = createServer(app);

const ws = crossws({
  hooks: {
    open(peer) {
      const connection = hocuspocus.handleConnection(
        peer.websocket as any,
        peer.request as any,
      );
      (peer as any)._hocuspocus = connection;
    },
    message(peer, message) {
      (peer as any)._hocuspocus?.handleMessage(message.uint8Array());
    },
    close(peer, event) {
      (peer as any)._hocuspocus?.handleClose({
        code: event.code,
        reason: event.reason,
      });
    },
  },
});

server.on('upgrade', (request, socket, head) => {
  ws.handleUpgrade(request, socket, head);
});

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
