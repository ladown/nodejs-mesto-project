import { Router } from 'express';

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
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
