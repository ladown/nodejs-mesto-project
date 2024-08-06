import type { Request, Response } from 'express';

import User from '../models/user';

import { USER_ID } from '../constants';

export const getUsers = (request: Request, response: Response) => {
  User.find({})
    .then((users) => response.send({ data: users }))
    .catch((err) => response.status(400).send(err));
};

export const getUserById = (request: Request, response: Response) => {
  User.findById(request.params.userId)
    .then((user) => response.send({ data: user }))
    .catch((err) => response.status(400).send(err));
};

export const createUser = (request: Request, response: Response) => {
  const { name, about, avatar } = request.body;

  User.create({ name, about, avatar })
    .then((user) => response.send({ data: user }))
    .catch((err) => response.status(400).send(err));
};

export const updateUserProfile = (request: Request, response: Response) => {
  const { name, about } = request.body;

  User.findByIdAndUpdate(USER_ID, { name, about }, { new: true })
    .then((user) => response.send({ data: user }))
    .catch((err) => response.status(400).send(err));
};

export const updateUserAvatar = (request: Request, response: Response) => {
  const { avatar } = request.body;

  User.findByIdAndUpdate(USER_ID, { avatar }, { new: true })
    .then((user) => response.send({ data: user }))
    .catch((err) => response.status(400).send(err));
};
