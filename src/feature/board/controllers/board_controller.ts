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
            return sendResponse({ res, message: 'board creation successful.', data: board })
        } catch (error) {
            return sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.BAD_REQUEST })
        }
    }
    async deleteBoard(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            let sections = await Section.find(
                { board: boardId }
            ).select("_id");
            let sectionIds = sections.map(s => s._id);
            await Task.deleteMany({ section: { $in: sectionIds } });
            await Section.deleteMany({ board: boardId })
            await Board.deleteOne({
                _id: boardId,
            });
            return sendResponse({ res, message: 'board deleted.', data: {} })
        } catch (error) {
            return sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.BAD_REQUEST })
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
                return sendResponse({ res, message: 'board not found', statusCode: StatusCode.BAD_REQUEST, error: { board } })
            }
            const sections = await Section.find({ board: boardId });
            for (const section of sections) {
                const tasks = await Task.find({ section: section.id }).populate('section').sort('position');
                (section as any)._doc.tasks = tasks;
            }
            (board as any)._doc.sections = sections;
            return sendResponse({ res, message: 'board retrived successful.', data: board })
        } catch (error) {
            return sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.BAD_REQUEST })
        }
    }
    async updateBoard(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            const { title, description, favourite } = req.body;

            if (title == '') req.body.title = 'Untitled';
            if (description == '') req.body.description = 'Add description here'

            const board = await Board.findById(boardId);
            if (!board) {
                return sendResponse({ res, message: 'board not found', statusCode: StatusCode.BAD_REQUEST, error: { board } })
            }
            if (favourite !== undefined && board.favourite !== favourite) {
                const favourites = await Board.find({
                    user: board.user,
                    favourite: true,
                    _id: { $ne: boardId }
                }).sort('favouritePosition')
                if (favourite) {
                    req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0
                } else {
                    for (const key in favourites) {
                        const element = favourites[key]
                        await Board.findByIdAndUpdate(
                            element.id,
                            { $set: { favouritePosition: key } }
                        )
                    }
                }
            }
            const updatedBoard = await Board.findByIdAndUpdate(
                boardId,
                { $set: req.body },
                { new: true }
            )
            return sendResponse({ res, message: 'board retrived successful.', data: updatedBoard })
        } catch (error) {
            return sendResponse({ res, message: 'error', error: error, statusCode: StatusCode.BAD_REQUEST })
        }
    }
    async getBoards(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    message: "token not found."
                })
            }
            const decoded = jwt.decode(token) as JwtPayload;
            const userId = decoded.userId;
            const boards = await Board.find({ user: userId, }).sort('position');
            return sendResponse({ res, message: "successful", data: boards })
        } catch (error) {
            return sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
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
            return sendResponse({ res, message: "updated successfully", data: '' })
        } catch (error) {
            return sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
    async getFavouriteBoards(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    message: "token not found."
                })
            }
            const decoded = jwt.decode(token) as JwtPayload;
            const userId = decoded.userId;
            const boards = await Board.find({ user: userId, favourite: true }).sort('favouritePosition');
            return sendResponse({ res, message: "successful", data: boards })
        } catch (error) {
            return sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
    async updateFavouritePosition(req: Request, res: Response) {
        try {
            const { boards } = req.body;
            for (const key in boards) {
                const board = boards[key];
                await Board.findByIdAndUpdate(
                    board.id,
                    { $set: { favouritePosition: key, } }
                )
            }
            return sendResponse({ res, message: "updated successfully", data: '' })
        } catch (error) {
            return sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }

}


export default BoardController;