import express from 'express';
import { connect } from 'mongoose';

import type { NextFunction, Request, Response } from 'express';

import usersRoute from './routes/users';
import cardsRoute from './routes/cards';

const app = express();

connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  // req.user = {
  //   _id: '5d8b8592978f8bd833ca8133'
  // };

  next();
});

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

// app.get('/', (req, res) => {
//   res.send('<p>GH</p>');
// });

app.listen(3000, () => {
  console.log('Server is listened on port 3000');
});
