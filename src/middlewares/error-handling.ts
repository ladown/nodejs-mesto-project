import type { Request, Response, NextFunction } from 'express';
import type { Error } from 'mongoose';

import { DefaultError, ConflictError, BadRequestError } from '../errors/index';
import generateValidationTextError from '../utils/generateValidationTextError';

const errorHandling = (
  error: Error & {
    statusCode: number;
    code?: number;
    errors: Record<string, Error.ValidatorError>;
  },
  request: Request,
  response: Response,
  _: NextFunction,
) => {
  let normalizedError = error.statusCode ? error : new DefaultError();

  if (error?.code === 11000) {
    normalizedError = new ConflictError(
      'При регистрации указан email, который уже существует на сервере',
    );
  } else if (error.name === 'ValidationError') {
    normalizedError = new BadRequestError(
      `Переданы некорректные данные при создании карточки${error.errors ? `: ${generateValidationTextError(error.errors)}` : '.'}`,
    );
  }

  response.status(normalizedError.statusCode).send({ message: normalizedError.message });
};

export default errorHandling;
