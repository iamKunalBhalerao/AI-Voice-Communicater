import { prisma } from "../db";

export async function createConversation(userId: string) {
  return prisma.conversation.create({
    data: {
      userId,
    },
  });
}
