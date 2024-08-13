import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import type { Request, Response, NextFunction } from 'express';

import User from '../models/user';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/index';

import type { ISessionRequest } from '../types/index';

export const getUser = (request: ISessionRequest, response: Response, next: NextFunction) => {
  const requestUser = request.user;
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  if (!userId) {
    next(new UnauthorizedError());
  }

  User.findById(userId)
    .then((user) => {
      response.send(user);
    })
    .catch(next);
};

export const getUsers = (request: Request, response: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      response.send(users);
    })
    .catch(next);
};

export const getUserById = (request: Request, response: Response, next: NextFunction) => {
  User.findById(request.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        response.send(user);
      }
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'CastError'
          ? new BadRequestError('Передан некорректный _id пользователя.')
          : error;

      next(errorToThrow);
    });
};

export const createUser = (request: Request, response: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = request.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      }),
    )
    .then((user) => {
      response.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

export const updateUserProfile = (
  request: ISessionRequest,
  response: Response,
  next: NextFunction,
) => {
  const { name, about } = request.body;
  const requestUser = request.user;
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  if (!userId) {
    next(new UnauthorizedError());
  }

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        response.send(user);
      }
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'CastError'
          ? new BadRequestError('Переданы некорректные данные при обновлении аватара.')
          : error;

      next(errorToThrow);
    });
};

export const updateUserAvatar = (
  request: ISessionRequest,
  response: Response,
  next: NextFunction,
) => {
  const { avatar } = request.body;
  const requestUser = request.user;
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  if (!userId) {
    next(new UnauthorizedError());
  }

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        response.send(user);
      }
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'CastError'
          ? new BadRequestError('Переданы некорректные данные при обновлении аватара.')
          : error;

      next(errorToThrow);
    });
};

export const loginUser = (request: Request, response: Response, next: NextFunction) => {
  const { email, password } = request.body;

  User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedError();
      } else {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
          throw new NotFoundError('Не найдена переменная окружения "JWT_SECRET"');
        } else {
          const token = jwt.sign({ _id: user._id }, jwtSecret, {
            expiresIn: '7d',
          });
          response
            .cookie('jwt', token, {
              maxAge: 604800000,
              httpOnly: true,
              sameSite: true,
            })
            .end();
        }
      }
    })
    .catch(next);
};
