import { VALIDATION_ERROR } from '../types/status';

class validationError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = VALIDATION_ERROR;
  }
}

export default validationError;