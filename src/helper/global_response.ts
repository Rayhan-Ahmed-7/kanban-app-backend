import { Response } from "express"
import { StatusCode } from "../types/util"

interface IResponse {
    res: Response,
    message?: string,
    statusCode?: StatusCode,
    data?: [] | null | unknown,
    error?: [] | null | unknown
}
export const sendResponse = ({ res, message, statusCode = 200, data, error }: IResponse) => {
    if (data) {
        res.status(statusCode).json({
            message: message,
            data: data,
        })
    } else {
        res.status(statusCode).json({
            message: message,
            error: error
        })
    }
}