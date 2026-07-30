import { AuthDAO } from "./auth.dao";
import { RegisterInput, LoginInput, AuthResponse } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { BadRequestError, UnauthorizedError } from "../../utils/errors";

export class AuthService {
  /**
   * Register a new user.
   */
  static async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await AuthDAO.findUserByEmail(input.email);
    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }

    const hashedPassword = await hashPassword(input.password);
    const user = await AuthDAO.createUser({
      ...input,
      password: hashedPassword,
    });

    const token = signToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  /**
   * Authenticate an existing user and generate JWT token.
   */
  static async login(input: LoginInput): Promise<AuthResponse> {
    const user = await AuthDAO.findUserByEmail(input.email);
    if (!user || !user.password) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = signToken({ userId: user.id, email: user.email });

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    return { user: safeUser, token };
  }

  /**
   * Handle user logout logic.
   */
  static async logout() {
    return { message: "Logout successful" };
  }
}
