import env from './lib/loadEnv.js';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: '*',
}));

app.use(express.json());

app.listen(env.PORT, () => {
  console.log(`Server started on port ${env.PORT}`);
});
