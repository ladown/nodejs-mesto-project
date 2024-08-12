import jwt from 'jsonwebtoken';

import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

import { UnauthorizedError, NotFoundError } from '../errors/index';

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => {
  return header.replace('Bearer ', '');
};

export default (request: SessionRequest, response: Response, next: NextFunction) => {
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new NotFoundError('Не найдена переменная окружения "JWT_SECRET"');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new UnauthorizedError();
  }

  request.user = payload;

  next();
};
