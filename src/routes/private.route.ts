import express from "express";
import { verifyRequest } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(verifyRequest);

router.get("/list1", (req, res) => {
  res.send("Private list 1 is accessed.");
});

export default router;
