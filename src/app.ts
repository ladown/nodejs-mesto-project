import express from 'express';
import { connect } from 'mongoose';

import type { Request, Response, NextFunction } from 'express';

import usersRoute from './routes/users';
import cardsRoute from './routes/cards';
import { DefaultError } from './errors/index';

const app = express();

connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);
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
