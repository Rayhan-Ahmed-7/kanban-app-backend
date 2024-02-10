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
                return res.status(StatusCode.UNAUTHORIZED).json({
                    status: StatusCode.UNAUTHORIZED,
                    message: "UNAUTHORIZED request token not found."
                });
            }

            const decoded = jwt.verify(token, AppCredentials.JWT_SECRET) as JwtPayload;
            if (!decoded || !decoded.username) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    status: StatusCode.UNAUTHORIZED,
                    message: "UNAUTHORIZED request."
                });
            }
            const user = await User.find({username:decoded.username});
            if (!user) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    status: StatusCode.UNAUTHORIZED,
                    message: "user not found request."
                });
            }
            
            next();
        } catch (err) {
            return res.status(StatusCode.UNAUTHORIZED).json({
                status: StatusCode.UNAUTHORIZED,
                message: "invalid token."
            });
        }

    }
}
export default new AuthMiddleware;