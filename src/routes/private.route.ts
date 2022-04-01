import express from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../services/jwt.services";
const router = express.Router();

router.use(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (await verifyToken(accessToken, "access")) {
    next();
  }
  //If access token is not verified.
  res.statusCode = 401;
  res.json({
    err: true,
    errMessage: "User not authenticated",
  });
});

router.get("/list1", (req, res) => {
  res.send("Private list 1 is accessed.");
});

export default router;
