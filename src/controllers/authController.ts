import { Request, Response } from "express";
import { StatusCode } from "../types/util";
import User from "../models/user_model";
import { generateToken } from "../utils/auth";

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
                res.status(StatusCode.success).json({
                    message: "login successfuly.",
                    data: {
                        id: user._id,
                        username: user.username
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
                generateToken(res, { username: user.username });
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
    async getUsers(req: Request, res: Response) {
        try {
            const users = await User.find();

            res.status(StatusCode.success).json({
                message: "user  list rettrived.",
                data: users
            });

        } catch (err) {
            res.status(StatusCode.serverError).json({
                message: "failed to load user list",
                data: null,
                error: err
            })
        }
    }
}

export default AuthController;