import express from 'express';
import cors from 'cors';

import signUp from './controllers/signUp.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/sign-up', signUp);

export default app;
