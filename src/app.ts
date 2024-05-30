import express, { Response, Request, NextFunction } from "express";
import { IError } from "./types/types";
import { SERVER_ERROR } from "./types/status";
import mongoose from "mongoose";
import { errors } from "celebrate";
import routes from "./routes/index";
import { login, createUser } from "./controllers/users";
import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import { validateLogin, validateUser } from "./validator/validator";

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

//Подключение логгеров
app.use(requestLogger);
app.use(errorLogger);

// Обработчики POST-запросов для '/signin' и '/signup'
app.post("/signin", validateLogin, login);
app.post("/signup", validateUser, createUser);

// Авторизация
app.use(auth);

// Роуты
app.use(routes);

app.use(errors());

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === SERVER_ERROR ? "Произошла ошибка на сервере" : message,
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
