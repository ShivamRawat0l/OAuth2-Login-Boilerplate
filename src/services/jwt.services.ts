import jwt from "jsonwebtoken";
import config from "../config/jwt.config";
import { getUserRefreshToken } from "../controllers/psql.controller";
import { JWTToken } from "../types/jwt.types";

async function verifyToken(
  token: string | undefined,
  key: string,
  verifyRefreshToken?: boolean
) {
  if (!token) return false;
  try {
    var decoded = jwt.verify(token, key) as unknown as JWTToken;
    if (verifyRefreshToken) {
      const refreshToken = await getUserRefreshToken(decoded.email);
      if (refreshToken?.rows[0].refresh_token !== token) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

function generateAccessToken(email: string) {
  const accessToken = jwt.sign(
    {
      email: email,
    },
    "access",
    { expiresIn: config.accessTokenTTL }
  );
  return accessToken;
}

function generateRefreshToken(email: string) {
  const refreshToken = jwt.sign(
    {
      email: email,
    },
    "refresh",
    { expiresIn: config.refreshTokenTTL }
  );
  return refreshToken;
}
export { verifyToken, generateAccessToken, generateRefreshToken };
