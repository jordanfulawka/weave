import express from 'express';
import authRouter from './routes/auth';
import docRouter from './routes/docs';
import userRouter from './routes/users';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//   console.log('get endpoint');
//   res.send(200).json({
//     message: 'get endpoint',
//   });
// });

app.use('/api/auth', authRouter);
app.use('/api/doc', docRouter);
app.use('/api/users', userRouter);

export default app;
