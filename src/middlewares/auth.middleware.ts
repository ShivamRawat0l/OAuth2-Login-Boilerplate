import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/jwt.services";

async function verifyRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<boolean> {
  const accessToken = req.cookies.accessToken;
  if (await verifyToken(accessToken, "access")) {
    next();
  }
  // If access token is not verified.
  res.statusCode = 401;
  res.json({
    err: true,
    errMessage: "User not authenticated",
  });
  return true;
}

export { verifyRequest };
