import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import Board from "../models/board_model";
import { sendResponse } from "../../../helper/global_response";
import { StatusCode } from "../../../types/util";
import AppCredentials from '../../../helper/credentials';

class BoardController {
    async createBoard(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(StatusCode.unAuthenticated).json({
                    message: "token not found."
                })
            }
            const decoded = jwt.decode(token) as JwtPayload;
            const userId = decoded.userId;
            const boardCount = await Board.countDocuments();
            let index = boardCount > 0 ? boardCount : 0;
            const board = await Board.create({
                user: userId,
                title: `title ${index}`,
                position: index
            });
            sendResponse({ res, message: 'board creation successful.', data: board })
        } catch (error) {
            sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.badRequest })
        }
    }
    async getBoards(req: Request, res: Response) {
        try {
            const boards = await Board.find().sort('position');
            sendResponse({ res, message: "successful", data: boards })
        } catch (error) {
            sendResponse({ res, statusCode: StatusCode.serverError, error: error })
        }
    }
    async updatePosition(req: Request, res: Response) {
        try {
            const { boards } = req.body;
            for (const key in boards) {
                const board = boards[key];
                await Board.findByIdAndUpdate(
                    board.id,
                    { $set: { position: key, } }
                )
            }
            sendResponse({ res, message: "updated successfully", data: '' })
        } catch (error) {
            sendResponse({ res, statusCode: StatusCode.serverError, error: error })
        }
    }
}


export default BoardController;