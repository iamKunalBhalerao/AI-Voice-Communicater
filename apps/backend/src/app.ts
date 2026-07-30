import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app: Express = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to AI voice app");
});

// Router imports
import authRouter from "./modules/auth/auth.route";
import testRouter from "./modules/tests/test.route";
import voiceRouter from "./modules/voice/voice.route";
import conversationRouter from "./modules/Conversation/conversation.route";
import { errorHandler } from "./lib/middleware/error.middleware";

// router mounts
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/test", testRouter);
app.use("/api/v1/voice", voiceRouter);
app.use("/api/v1/conversation", conversationRouter);

// Global error handler middleware
app.use(errorHandler);

export default app;
