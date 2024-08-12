import { Router } from 'express';

import { getUserById, getUsers, updateUserAvatar, updateUserProfile } from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
