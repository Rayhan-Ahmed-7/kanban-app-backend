import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../types/util";
import AppCredentials from '../helper/credentials';
import User from '../feature/auth/models/user_model';

class AuthMiddleware {
    async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            let token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(StatusCode.unAuthenticated).json({
                    status: StatusCode.unAuthenticated,
                    message: "unauthenticated request token not found."
                });
                return;
            }

            const decoded = jwt.verify(token, AppCredentials.JWT_SECRET) as JwtPayload;
            if (!decoded || !decoded.username) {
                res.status(StatusCode.unAuthenticated).json({
                    status: StatusCode.unAuthenticated,
                    message: "unauthenticated request."
                });
                return;
            }
            const user = await User.find({username:decoded.username});
            if (!user) {
                res.status(StatusCode.unAuthenticated).json({
                    status: StatusCode.unAuthenticated,
                    message: "user not found request."
                });
                return;
            }
            
            next();
        } catch (err) {
            res.status(StatusCode.unAuthenticated).json({
                status: StatusCode.unAuthenticated,
                message: "invalid token."
            });
        }

    }
}
export default new AuthMiddleware;