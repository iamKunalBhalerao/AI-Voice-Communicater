import { z } from "zod";
import { Request } from "express";

// Validation Schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name cannot be empty").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Inferred TypeScript Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
