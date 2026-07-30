import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UnauthorizedError } from "./errors";

export interface JWTPayload {
  userId: string;
  email: string;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

/**
 * Sign a JWT token with the given payload.
 */
export const signToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verify a JWT token and return the decoded payload.
 * Throws UnauthorizedError if invalid or expired.
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Token has expired. Please log in again.");
    }
    throw new UnauthorizedError("Invalid authentication token.");
  }
};
