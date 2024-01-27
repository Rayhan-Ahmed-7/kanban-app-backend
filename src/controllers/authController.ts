import { Request, Response } from "express";
import { StatusCode } from "../types/util";
import User from "../models/user_model";
import { generateToken } from "../utils/auth";

class AuthController {
    async login(req: Request, res: Response) {
        try {
            res.status(StatusCode.created).json({
                message: "created",
                data: req.body
            })
        } catch (err) {
            res.status(StatusCode.serverError).json({
                message: "failed",
                data: null
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
                })
            }
            const user = await User.create({
                username: username,
                password: password
            });
            if (user) {
                generateToken(res, user);
                res.status(StatusCode.created).json({
                    message: "user registered successfuly.",
                    data: user,
                });
            }

        } catch (err) {
            res.status(StatusCode.serverError).json({
                message: "failed",
                data: null,
                error:err
            })
        }
    }
}

export default AuthController;