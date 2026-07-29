import { Router } from "express";
import { prisma } from "../../db";

const testRouter: Router = Router();

testRouter.get("/users", async (_, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default testRouter;
