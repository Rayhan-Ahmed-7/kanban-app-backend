import { Request, Response } from "express";
import { sendResponse } from "../../../helper/global_response";
import { StatusCode } from "../../../types/util";
import Section from "../model/section_model";
import Task from "../../task/models/task_model";

class SectionController {
    async create(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            const section = await Section.create({ board: boardId, title: 'Untitled' });
            (section as any)._doc.tasks = [];
            return sendResponse({
                res,
                message: "successful",
                statusCode: StatusCode.OK,
                data: section,
            })
        } catch (error) {
            return sendResponse({
                res,
                message: "serverError",
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
                error: error,
            })
        }
    }
    async update(req: Request, res: Response) {
        try {
            const { sectionId } = req.params;
            const section = await Section.findByIdAndUpdate(
                sectionId,
                { $set: req.body }
            );
            (section as any)._doc.tasks = [];
            return sendResponse({
                res,
                message: "successful",
                statusCode: StatusCode.OK,
                data: section,
            })
        } catch (error) {
            return sendResponse({
                res,
                message: "serverError",
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
                error: error,
            })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const { sectionId } = req.params;
            await Task.deleteMany({ section: sectionId });
            const section = await Section.deleteOne(
                { _id: sectionId }
            );
            return sendResponse({
                res,
                message: "successful",
                statusCode: StatusCode.OK,
                data: { section },
            })
        } catch (error) {
            return sendResponse({
                res,
                message: "serverError",
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
                error: error,
            })
        }
    }
}

export default SectionController;