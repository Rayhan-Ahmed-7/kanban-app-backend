import { Response } from "express";
import jwt from "jsonwebtoken";
import AppCredentials from "../helper/credentials";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constant";
class JwtService {
  generateToken(res: Response, data: { username: string; userId: string }) {
    const access_token = jwt.sign(data, AppCredentials.JWT_SECRET, {
      expiresIn: "1d",
    });
    const refresh_token = jwt.sign(data, AppCredentials.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.cookie(REFRESH_TOKEN, refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV != "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return access_token;
  }
  clearToken(res: Response) {
    res.cookie(REFRESH_TOKEN, "", {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}

export const { generateToken, clearToken } = new JwtService();
