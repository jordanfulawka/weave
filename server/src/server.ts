import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  console.log('get endpoint');
  res.send(200).json({
    message: 'get endpoint',
  });
});

export default app;
