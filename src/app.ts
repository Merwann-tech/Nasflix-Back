import express, { type Application, type Request, type Response } from 'express';
import { notFound } from './middlewares/notFound.js';
import router from './routes/index.js';
import cors from 'cors';
const app: Application = express();

app.use(cors());
app.use(express.json());


app.get('/', (_req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});

app.get('/test', (_req: Request, res: Response) => {
  res.send('This is a test route' );
});


app.use('/', router)



app.use(notFound);

const PORT : number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});