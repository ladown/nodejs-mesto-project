import { model, Schema } from 'mongoose';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  },
);

export default model<ICard>('card', cardSchema);
