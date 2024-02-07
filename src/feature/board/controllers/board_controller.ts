import { body } from 'express-validator';
import { Request, Response } from "express";
import Board from "../models/board_model";
import { sendResponse } from "../../../helper/global_response";
import { StatusCode } from "../../../types/util";

class BoardController {
    async createBoard(req: Request, res: Response) {
        try {
            const boardCount = await Board.countDocuments();
            const board = await Board.create({
                user: req.body.userId,
                position: boardCount > 0 ? boardCount : 0
            });
            sendResponse({ res, message: 'board creation successful.', data: board })
        } catch (error) {
            sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.badRequest })
        }
    }
    async getBoards(req: Request, res: Response) {
        try {
            const boards = await Board.find().sort('-position');
            sendResponse({ res, message: "successful", data: boards })
        } catch (error) {
            sendResponse({ res, statusCode: StatusCode.serverError, error: error  })
        }
    }
}


export default  BoardController;