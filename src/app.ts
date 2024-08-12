import express from 'express';
import { connect } from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import type { Request, Response, NextFunction } from 'express';

import authMiddleware from './middlewares/auth';
import usersRoute from './routes/users';
import cardsRoute from './routes/cards';
import { DefaultError, NotFoundError } from './errors/index';
import { loginUser, createUser } from './controllers/users';

const app = express();

connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.post('/signin', loginUser);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(
  (
    error: Error & { statusCode: number },
    request: Request,
    response: Response,
    _: NextFunction,
  ) => {
    const normalizedError = error.statusCode ? error : new DefaultError();

    response.status(normalizedError.statusCode).send({ message: normalizedError.message });
  },
);

app.listen(3000, () => {
  console.log('Server is listened on port 3000');
});
