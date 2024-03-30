import { model, Model, Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import unauthorizedError from "../errors/UnauthorizedError";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (link: string) => {
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
          link
        );
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: "Incorrect type of email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(
    email: string,
    password: string
  ): Promise<IUser | null> {
    return this.findOne({ email })
      .select("+password")
      .then((user: IUser | null) => {
        if (!user) {
          return Promise.reject(new unauthorizedError("Неправильный e-mail"));
        }
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new unauthorizedError("Неправильный пароль"));
          }

          return user;
        });
      });
  }
);

export default model<IUser, UserModel>("user", userSchema);
