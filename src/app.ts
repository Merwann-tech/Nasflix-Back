import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
const app: Application = express();
app.use(cors());




app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});

app.get('/test', (req: Request, res: Response) => {
  res.send('This is a test route' );
});





const PORT : number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});