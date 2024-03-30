import { FORBIDDEN_ACTION } from "../types/status";

class forbiddenError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = FORBIDDEN_ACTION;
  }
}

export default forbiddenError;
