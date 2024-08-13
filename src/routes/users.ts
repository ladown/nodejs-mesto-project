import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';

import {
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserProfile,
  getUser,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/me', getUser);
userRouter.get('/', getUsers);
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUserById,
);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }),
  updateUserProfile,
);
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }),
  updateUserAvatar,
);

export default userRouter;
