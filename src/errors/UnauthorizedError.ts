import { UNAUTHORIZED } from "../types/status";

class unauthorizedError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

export default unauthorizedError;
