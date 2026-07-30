import { GoogleGenAI } from "@google/genai";
import { BadRequestError } from "../utils/errors";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

export async function createLiveSession() {
  try {
    const data = await client.authTokens.create({
      config: {
        uses: 1, // The default
        expireTime: expireTime,
        liveConnectConstraints: {
          model: "gemini-3.1-flash-live-preview",
          config: {
            sessionResumption: {},
            responseModalities: ["AUDIO"],
          },
        },
      },
    });
    return data;
  } catch (error) {
    throw new BadRequestError("Failed to create Gemini session");
  }
}
