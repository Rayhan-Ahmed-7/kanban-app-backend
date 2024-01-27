import { Response } from "express";
import { IUser } from "../types/user";
import jwt from "jsonwebtoken"
import AppCredentials from "../helper/credentials";
import { ACCESS_TOKEN } from "../constants/constant";
class JwtService {
    generateToken(res: Response, data: IUser) {
        const token = jwt.sign(data, AppCredentials.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.cookie(ACCESS_TOKEN, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV != "development",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        })
    }
    clearToken(res: Response) {
        res.cookie(ACCESS_TOKEN, "", {
            httpOnly: true,
            expires: new Date(0)
        })
    }
}

export const { generateToken, clearToken } = new JwtService()