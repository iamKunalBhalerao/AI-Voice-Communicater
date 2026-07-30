import { Router } from "express";
import {
  createVoiceEvents,
  createVoiceSession,
  endVoiceSession,
} from "./voice.controller";

const voiceRouter: Router = Router();

voiceRouter.route("/session").post(createVoiceSession);
voiceRouter.route("/events").post(createVoiceEvents);
voiceRouter.route("/end").post(endVoiceSession);

export default voiceRouter;
