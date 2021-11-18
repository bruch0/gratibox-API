import express from 'express';
import cors from 'cors';

import signUp from './controllers/signUp.js';
import signIn from './controllers/signIn.js';
import subscribeUser from './controllers/subscribe.js';
import authenticationJWT from './middlewares/authenticationJWT.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/subscribe', authenticationJWT);

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.post('/subscribe', subscribeUser);

export default app;
