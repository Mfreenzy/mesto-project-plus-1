import { Date, model, ObjectId, Schema } from "mongoose";

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: string[];
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
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: [{ type: Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>("Card", cardSchema);
