import { Response, NextFunction, RequestHandler } from "express";
import { verifyToken } from "../../utils/jwt";
import { AuthDAO } from "../../modules/auth/auth.dao";
import { AuthRequest } from "../../modules/auth/auth.types";
import { UnauthorizedError } from "../../utils/errors";
import { asyncHandler } from "../../utils/asyncHandler";
import { AUTH_COOKIE_NAME } from "../../config/cookie.config";

/**
 * Authentication middleware to protect routes.
 * Extracts cookie-based token (or Bearer token fallback), verifies JWT, and attaches authenticated user to req.user.
 */
export const protect: RequestHandler = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Check HttpOnly cookie first
    if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
      token = req.cookies[AUTH_COOKIE_NAME];
    }
    // 2. Fall back to Authorization Bearer header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new UnauthorizedError("You are not logged in. Please log in to access this resource.");
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await AuthDAO.findUserById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("The user belonging to this token no longer exists.");
    }

    // Attach user to request
    req.user = user;
    next();
  }
);

export default protect;
