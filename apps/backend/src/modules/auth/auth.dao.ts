import { prisma } from "../../db";
import { RegisterInput } from "./auth.types";

export class AuthDAO {
  /**
   * Find a user by email address.
   */
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by ID without returning sensitive password field.
   */
  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  /**
   * Create a new user record in the database.
   */
  static async createUser(data: RegisterInput & { password: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }
}
