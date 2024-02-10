import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import Board from "../models/board_model";
import { sendResponse } from "../../../helper/global_response";
import { StatusCode } from "../../../types/util";
import Section from '../../section/model/section_model';
import Task from '../../task/models/task_model';

class BoardController {
    async createBoard(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(StatusCode.UNAUTHORIZED).json({
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
            sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.BAD_REQUEST })
        }
    }
    async getBoard(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    message: "token not found."
                })
            }
            const decoded = jwt.decode(token) as JwtPayload;
            const userId = decoded.userId;
            const board = await Board.findOne({
                user: userId,
                _id: boardId
            });
            if (!board) {
                sendResponse({ res, message: 'board not found', statusCode: StatusCode.BAD_REQUEST, error: {} })
            }
            const sections = await Section.find({ board: boardId });
            for (const section of sections) {
                const tasks = await Task.find({ section: section.id }).populate('section').sort('position');
                (section as any)._doc.tasks = tasks;
            }
            (board as any)._doc.sections = sections;
            sendResponse({ res, message: 'board retrived successful.', data: board })
        } catch (error) {
            sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.BAD_REQUEST })
        }
    }
    async getBoards(req: Request, res: Response) {
        try {
            const boards = await Board.find().sort('position');
            sendResponse({ res, message: "successful", data: boards })
        } catch (error) {
            sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
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
            sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
}


export default BoardController;