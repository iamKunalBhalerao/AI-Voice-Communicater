import { Request, Response } from "express";
import { createConversation } from "./voice.service";
import { createLiveSession } from "../../services/gemini.service";

export const createVoiceSession = async (req: Request, res: Response) => {
  try {
    const user = "cms7j55330000qlupq20mv1cf";

    const conversation = await createConversation(user);

    const gemini = await createLiveSession();

    if (!gemini) {
      throw new Error("Unable to get Gemini in voice controller");
    }

    res.status(200).json({
      conversationId: conversation.id,
      ephemeralToken: gemini,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to create voice session",
    });
  }
};

export const createVoiceEvents = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to create voice session",
    });
  }
};

export const endVoiceSession = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to create voice session",
    });
  }
};
