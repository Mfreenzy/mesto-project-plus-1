import { Date, model, ObjectId, Schema } from "mongoose";

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link: string) => {
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
          link
        );
      },
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>("card", cardSchema);
