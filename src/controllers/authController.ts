import { Request, Response } from "express";
import { StatusCode } from "../types/util";

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
}

export default AuthController;