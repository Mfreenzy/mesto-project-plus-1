import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import unauthorizedError from "../errors/UnauthorizedError";

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const auth = async (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new unauthorizedError("Необходима авторизация"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (error) {
    const newError = new unauthorizedError("Авторизуйтесь для выполнения");
    return next(newError);
  }
  req.user = payload;
  next();
};

export default auth;
