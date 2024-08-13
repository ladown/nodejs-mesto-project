import express from 'express';
import { connect } from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { Joi, celebrate, errors } from 'celebrate';
import 'dotenv/config';

import authMiddleware from './middlewares/auth';
import errorHandling from './middlewares/error-handling';
import rateLimit from './middlewares/rate-limit';
import usersRoute from './routes/users';
import cardsRoute from './routes/cards';
import { NotFoundError } from './errors/index';
import { loginUser, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();

connect('mongodb://localhost:27017/mestodb');

app.use(rateLimit);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().required().uri(),
    }),
  }),
  createUser,
);

app.use(authMiddleware);

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandling);

app.listen(PORT);
