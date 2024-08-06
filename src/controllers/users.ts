import type { Request, Response } from 'express';

import User from '../models/user';

export const getUsers = (request: Request, response: Response) => {
  User.find({})
    .then((users) => response.send({ data: users }))
    .catch((err) => response.status(400).send(err));
};

export const getUserById = (request: Request, response: Response) => {
  const { userId } = request.params;

  if (userId) {
    User.findOne({ _id: userId })
      .then((user) => response.send({ data: user }))
      .catch((err) => response.status(400).send(err));
  }
};

export const createUser = (request: Request, response: Response) => {
  const { name, about, avatar } = request.body;

  User.create({ name, about, avatar })
    .then((user) => response.send({ data: user }))
    .catch((err) => response.status(400).send(err));
};
