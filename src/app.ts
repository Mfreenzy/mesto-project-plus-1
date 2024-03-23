import express, { Response } from 'express';
import mongoose from 'mongoose';
import { IRequest } from './types/types';
import routes from './routes/index';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
}).then(() => {
  console.log('Подключение к MongoDB успешно');
}).catch((error) => {
  console.error('Ошибка подключения к MongoDB:', error);
});

app.use((req: IRequest, res: Response, next) => {
  req.user = { _id: '64442f4253e0cd4e2d79990d' };

  next();
});

app.use(routes);
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});