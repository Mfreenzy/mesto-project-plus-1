import express, { Response } from "express";
import mongoose from "mongoose";
import { IRequest } from "./types/types";
import routes from "./routes/index";
import { login, createUser } from "./controllers/users";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к серверу MongoDB
mongoose
  .connect("mongodb://localhost:27017/mestodb", {})
  .then(() => {
    console.log("Подключение к MongoDB успешно");
  })
  .catch((error) => {
    console.error("Ошибка подключения к MongoDB:", error);
  });

app.use((req: IRequest, res: Response, next) => {
  req.user = { _id: "65ff0f0def7abb4a3aa6a469" };

  next();
});

// Обработчики POST-запросов для '/signin' и '/signup'
app.post('/signin', login);
app.post('/signup', createUser);

app.use(routes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
