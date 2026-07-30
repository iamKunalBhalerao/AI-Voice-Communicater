import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/errors";
import { logger } from "../../utils/logger";

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details to client
    logger.error("Unhandled non-operational error:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong on the server",
    });
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Internal Server Error";
  let isOperational = err.isOperational;

  // Ensure message and properties are mapped correctly for standard non-AppError errors
  if (!(err instanceof AppError)) {
    isOperational = false;
  }

  // Handle specific MongoDB/Mongoose/DB or JWT errors if they arise
  // e.g. CastError, ValidationError, JsonWebTokenError, TokenExpiredError
  if (err.name === "CastError") {
    message = `Invalid value for path: ${err.path}`;
    statusCode = 400;
    status = "fail";
    isOperational = true;
  } else if (err.name === "ZodError" || err.issues) {
    const issues = err.issues || err.errors || [];
    message = issues.map((issue: any) => `${issue.path.join(".")}: ${issue.message}`).join("; ") || err.message;
    statusCode = 400;
    status = "fail";
    isOperational = true;
  } else if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((el: any) => el.message)
      .join(". ");
    statusCode = 400;
    status = "fail";
    isOperational = true;
  } else if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please log in again.";
    statusCode = 401;
    status = "fail";
    isOperational = true;
  } else if (err.name === "TokenExpiredError") {
    message = "Your token has expired. Please log in again.";
    statusCode = 401;
    status = "fail";
    isOperational = true;
  }

  const appError = new AppError(message, statusCode, isOperational);
  appError.stack = err.stack;

  // Log error using application logger
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === "production") {
    sendErrorProd(appError, res);
  } else {
    sendErrorDev(appError, res);
  }
};
