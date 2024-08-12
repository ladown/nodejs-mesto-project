import bcrypt from 'bcryptjs';

import type { Request, Response, NextFunction } from 'express';

import User from '../models/user';
import { BadRequestError, NotFoundError } from '../errors/index';
import { USER_ID } from '../constants';
import generateValidationTextError from '../utils/generateValidationTextError';

export const getUsers = (request: Request, response: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      response.send(users);
    })
    .catch((error) => {
      next(error);
    });
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
      response.status(201).send(user);
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'ValidationError'
          ? new BadRequestError(
              `Переданы некорректные данные при создании пользователя${error.errors ? `: ${generateValidationTextError(error.errors)}` : '.'}`,
            )
          : error;

      next(errorToThrow);
    });
};

export const updateUserProfile = (request: Request, response: Response, next: NextFunction) => {
  const { name, about } = request.body;

  User.findByIdAndUpdate(USER_ID, { name, about }, { new: true })
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

export const updateUserAvatar = (request: Request, response: Response, next: NextFunction) => {
  const { avatar } = request.body;

  User.findByIdAndUpdate(USER_ID, { avatar }, { new: true })
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
