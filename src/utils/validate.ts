import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import mongoose from "mongoose";
import { StatusCode } from "../types/util";
const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => {
            let acc: Record<string, string> = {}
            acc[(error as any).path] = error.msg;
            return acc;
        });
        res.status(StatusCode.BAD_REQUEST).json({
            errors: formattedErrors
        })
        return;
    }
    next();
};

const isObjectId = (value: any) => mongoose.isValidObjectId(value);

export { validate, isObjectId };