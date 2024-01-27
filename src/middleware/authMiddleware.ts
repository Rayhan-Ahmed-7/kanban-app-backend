import { Request, Response } from "express";
import { StatusCode } from "../types/util";

class AuthMiddleware {
    async authenticate(req: Request, res: Response) {
        const token = req.cookies.access_token;
        if (!token) {
            res.status(StatusCode.unAuthenticated).json({
                message: "unauthenticated request."
            })
        }
        
    }
}