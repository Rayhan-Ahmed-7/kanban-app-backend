import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { StatusCode } from "../../../types/util";
import { generateToken } from "../../../utils/auth";
import AppCredentials from "../../../helper/credentials";
import User from "../models/user_model";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(StatusCode.NOT_FOUND).json({
          message: "wrong username!",
        });
      }
      if (user && (await user.comparePassword(password))) {
        let accessToken = generateToken(res, {
          userId: user.id,
          username: user.username,
        });
        return res.status(StatusCode.OK).json({
          message: "login successfuly.",
          data: {
            id: user._id,
            username: user.username,
            access_token: accessToken,
          },
        });
      } else {
        return res.status(StatusCode.NOT_FOUND).json({
          message: "wrong password",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "failed",
        data: null,
        error: err,
      });
    }
  }
  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const userExists = await User.findOne({ username: username });
      if (userExists) {
        return res.status(StatusCode.BAD_REQUEST).json({
          message: "user already exists with this name!",
        });
      }
      const user = await User.create({
        username: username,
        password: password,
      });
      if (user) {
        return res.status(StatusCode.OK).json({
          message: "user registered successfuly.",
          data: {
            id: user._id,
            username: user.username,
          },
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "failed",
        data: null,
        error: err,
      });
    }
  }

  // async logOut(req: Request, res: Response) {
  //     try {
  //         const token = req.headers.authorization?.split(" ")[1]
  //         jwt.
  //     } catch (err) {
  //         console.log(err)
  //     }
  // }

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "Token not found.",
        });
      }

      const decoded = jwt.verify(
        token,
        AppCredentials.JWT_SECRET
      ) as JwtPayload;

      if (!decoded || !decoded.username) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "Unauthenticated request.",
        });
      }

      const user = await User.findOne({ username: decoded.username });

      if (!user) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "User not found.",
        });
      }

      return res.status(StatusCode.OK).json({
        message: "Authenticated.",
        data: {
          id: user._id,
          username: user.username,
        },
      });
    } catch (err) {
      // console.error("Error verifying token:", err);
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: "Failed to verify the user",
        error: err,
      });
    }
  }
  async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.refresh_token;
      if (!token) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "Token not found.",
        });
      }

      const decoded = jwt.verify(
        token,
        AppCredentials.JWT_SECRET
      ) as JwtPayload;

      if (!decoded || !decoded.username) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "Unauthenticated request.",
        });
      }

      const user = await User.findOne({ username: decoded.username });

      if (!user) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "User not found.",
        });
      }

      const accessToken = generateToken(res, {
        username: user.username,
        userId: user.id,
      });

      return res.status(StatusCode.OK).json({
        message: "Token refreshed successfully.",
        data: {
          id: user._id,
          username: user.username,
          access_token: accessToken,
        },
      });
    } catch (err) {
      console.error("Error refreshing token:", err);
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: "Failed to refresh token.",
        data: null,
        error: err,
      });
    }
  }
}

export default AuthController;
