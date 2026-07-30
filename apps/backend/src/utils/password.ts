import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password.
 */
export const comparePassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};
