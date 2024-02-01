import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import { StatusCode } from "../../../types/util";
import { generateToken } from "../../../utils/auth";
import AppCredentials from '../../../helper/credentials';
import User from '../models/user_model';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            console.log(password)
            const user = await User.findOne({ username: username });
            if (!user) {
                res.status(StatusCode.error).json({
                    message: "wrong username!"
                });
                return;
            }
            if (user && (await user.comparePassword(password))) {
                let accessToken = generateToken(res, { username: user.username });
                res.status(StatusCode.success).json({
                    message: "login successfuly.",
                    data: {
                        id: user._id,
                        username: user.username,
                        access_tokeen:accessToken
                    },
                });
            } else {
                res.status(StatusCode.error).json({
                    message: "wrong password"
                })
            }

        } catch (err) {
            console.log(err)
            res.status(StatusCode.serverError).json({
                message: "failed",
                data: null,
                error: err
            })
        }
    }
    async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const userExists = await User.findOne({ username: username });
            if (userExists) {
                res.status(StatusCode.error).json({
                    message: "user already exists with this name!"
                });
                return;
            }
            const user = await User.create({
                username: username,
                password: password
            });
            if (user) {
                res.status(StatusCode.created).json({
                    message: "user registered successfuly.",
                    data: {
                        id: user._id,
                        username: user.username
                    },
                });
            }

        } catch (err) {
            console.log(err)
            res.status(StatusCode.serverError).json({
                message: "failed",
                data: null,
                error: err
            })
        }
    }
    
    async verifyToken(req: Request, res: Response) {
        try {
            const token = req.cookies.jwt;
            if (!token) {
                return res.status(StatusCode.unAuthenticated).json({
                    message: "token not found."
                })
            }
            const decoded = jwt.verify(token, AppCredentials.JWT_SECRET) as JwtPayload;
            if (!decoded || !decoded.username) {
                res.status(StatusCode.unAuthenticated).json({
                    status: StatusCode.unAuthenticated,
                    message: "unauthenticated request."
                });
                return;
            }
            const user = await User.find({ username: decoded.username });
            if (user) {
                res.status(StatusCode.success).json({
                    message: "authenticated.",
                    data: user
                });
                return;
            }

        } catch (err) {
            res.status(StatusCode.serverError).json({
                message: "failed to load user",
                data: null,
                error: err
            })
        }
    }
}

export default AuthController;