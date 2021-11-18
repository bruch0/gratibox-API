import express from 'express';
import cors from 'cors';

import signUp from './controllers/signUp.js';
import signIn from './controllers/signIn.js';
import authenticationJWT from './middlewares/authenticationJWT.js';
import { subscribeUser, changeSubscription } from './controllers/subscribe.js';
import getUserSubscription from './controllers/getUserSubscription.js';
import getUserInfo from './controllers/getUserInfo.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/subscribe', authenticationJWT);
app.use('/get-subscription', authenticationJWT);
app.use('/user-info', authenticationJWT);

app.post('/sign-up', signUp);

app.post('/sign-in', signIn);

app.post('/subscribe', subscribeUser);

app.put('/subscribe', changeSubscription);

app.get('/get-subscription', getUserSubscription);

app.get('/user-info', getUserInfo);

export default app;
