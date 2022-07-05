class AppError extends Error {
  readonly statusCode: Number;
  readonly status: string;
  readonly isOperational: Boolean;
  constructor(message: string, statusCode:Number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
