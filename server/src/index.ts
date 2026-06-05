import 'dotenv/config';
import app from './server';
import server from './websocket';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

server.listen();
