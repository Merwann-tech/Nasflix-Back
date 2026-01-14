import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
const app: Application = express();

app.use(cors());
app.use(express.json());

// import { prisma } from './lib/prisma.js'

// async function main() {
//     // Create a new user
//     const user = await prisma.user.create({
//         data: {
//             firstname: 'Merwann',
//             lastname: 'Heret',
//             email: 'Merwann@prisma.io',
//             password: 'securepassword',
//         },
//     })
//     console.log('Created user:', user)

//     // Fetch all users
//     const allUsers = await prisma.user.findMany()
//     console.log('All users:', JSON.stringify(allUsers, null, 2))
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })



app.get('/', (_req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});

app.get('/test', (_req: Request, res: Response) => {
  res.send('This is a test route' );
});





const PORT : number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});