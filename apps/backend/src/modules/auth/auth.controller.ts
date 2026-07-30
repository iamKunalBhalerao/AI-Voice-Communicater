import { Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema, AuthRequest } from "./auth.types";
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "../../config/cookie.config";

/**
 * Controller for user registration.
 */
export const register: RequestHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const result = await AuthService.register(validatedData);

    res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  },
);

/**
 * Controller for user login.
 */
export const login: RequestHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);

    res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  },
);

/**
 * Controller for user logout.
 */
export const logout: RequestHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await AuthService.logout();

    res.clearCookie(AUTH_COOKIE_NAME, {
      ...getAuthCookieOptions(),
      maxAge: 0,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  },
);

/**
 * Controller to get current authenticated user profile.
 */
export const getMe: RequestHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  },
);
