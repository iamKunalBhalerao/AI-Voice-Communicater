import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * A wrapper for Express async route handlers to catch rejected promises 
 * and automatically forward them to the global error middleware.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
