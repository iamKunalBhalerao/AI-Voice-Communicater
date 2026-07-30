import { apiClient } from "./api";

export async function createSession() {
  try {
    const res = await apiClient.post("/voice/session");

    const { conversationId, ephemeralToken } = res.data;

    return { conversationId, ephemeralToken };
  } catch (error) {
    console.error("Error creating voice session:", error);
    throw error;
  }
}
