import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to AI voice app");
});

// Router imports
import testRouter from "./modules/tests/test.route";

// router mounts
app.use("/api/v1/test", testRouter);

export default app;
