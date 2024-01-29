import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCode } from "../types/util";
import mongoose from "mongoose";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(StatusCode.error).json({
            errors: errors.array()
        })
        return;
    }
    next();
};

const isObjectId = (value: any) => mongoose.isValidObjectId(value);

export { validate, isObjectId };