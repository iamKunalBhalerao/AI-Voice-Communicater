import { CookieOptions } from "express";

export const AUTH_COOKIE_NAME = "token";

/**
 * Returns cookie options for setting authentication JWT.
 */
export const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
};
