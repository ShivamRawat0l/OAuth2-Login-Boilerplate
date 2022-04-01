import express from "express";
import config from "../config/jwt.config";
import {
  insertNewUser,
  setRefreshToken,
  verifyUserLogin,
} from "../controllers/psql.controller";
import {
  generateRefreshToken,
  generateAccessToken,
  verifyToken,
} from "../services/jwt.services";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const result = await insertNewUser(req.body.email, req.body.password);
  if (result?.severity === "ERROR") {
    res.json({
      userCreated: false,
      email: req.body.email,
      severity: result?.severity,
      code: result?.code,
      detail: result?.detail,
    });
  }
  //Error occurs if the user is already created
  else {
    res.json({
      userCreated: true,
      email: req.body.email,
      rowCount: result?.rowCount,
    });
  }
});

router.post("/login", async (req, res) => {
  const isUserVerified = await verifyUserLogin(
    req.body.email,
    req.body.password
  );

  if (isUserVerified) {
    const accessToken = generateAccessToken(req.body.email);
    const refreshToken = generateRefreshToken(req.body.email);
    setRefreshToken(req.body.email, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + config.accessTokenTTL),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/auth/refresh",
      expires: new Date(Date.now() + config.refreshTokenTTL),
    });
    res.json({
      authenticated: true,
    });
  }
  //Error occurs when user password is not valid
  else {
    res.json({
      authenticated: false,
    });
  }
});

router.post("/refresh", async (req, res) => {
  if (await verifyToken(req.cookies.refreshToken, "refresh", true)) {
    const accessToken = generateAccessToken(req.body.email);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 10000),
    });
    res.json({
      err: false,
    });
  }
  //Error occurs when validating the token
  else {
    res.json({
      err: true,
    });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({
    logout: true,
  });
});

export default router;
