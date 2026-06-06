import express from 'express';
import authRouter from './routes/auth';

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   console.log('get endpoint');
//   res.send(200).json({
//     message: 'get endpoint',
//   });
// });

app.use('/api/auth', authRouter);

export default app;
