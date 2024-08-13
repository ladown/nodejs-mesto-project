import express from 'express';
import { connect } from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authMiddleware from './middlewares/auth';
import errorHandling from './middlewares/error-handling';
import usersRoute from './routes/users';
import cardsRoute from './routes/cards';
import { NotFoundError } from './errors/index';
import { loginUser, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', loginUser);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errorHandling);

app.listen(3000, () => {
  console.log('Server is listened on port 3000');
});
