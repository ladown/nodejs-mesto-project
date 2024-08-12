import { model, Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [200, 'Максимальная длина поля "about" - 30'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (avatarValue: string) => isURL(avatarValue),
        message: 'Некорректный URL поля "avatar"',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (emailValue: string) => isEmail(emailValue),
        message: 'Некорректное значение поля "email"',
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

export default model<IUser>('user', userSchema);
