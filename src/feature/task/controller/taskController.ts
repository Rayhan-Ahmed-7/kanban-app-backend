import { Request, Response } from "express";
import Task from "../models/task_model";
import { sendResponse } from "../../../helper/global_response";
import { StatusCode } from "../../../types/util";

class TaskController {
    async create(req: Request, res: Response) {
        try {
            const { sectionId } = req.body;
            const tasksCount = await Task.find({ section: sectionId }).countDocuments();
            let task = await Task.create({
                section: sectionId,
                position: tasksCount > 0 ? tasksCount : 0
            });
            return sendResponse({ res, message: "successful", statusCode: StatusCode.OK, data: task })
        } catch (error) {
            return sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
    async update(req: Request, res: Response) {
        try {
            const { taskId } = req.body;
            const task = await Task.findByIdAndUpdate(
                taskId,
                { $set: req.body }
            );
            return sendResponse({ res, message: "successful", statusCode: StatusCode.OK, data: task })
        } catch (error) {
            return sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const { taskId } = req.body;
            const currentTask = await Task.findById(taskId);
            const task = await Task.deleteOne(
                { _id: taskId }
            );
            const tasks = await Task.find({
                section: currentTask?.section
            }).sort('position');
            for (const key in tasks) {
                await Task.findByIdAndUpdate(
                    tasks[key].id,
                    {
                        $set: { position: key }
                    }
                )
            }
            return sendResponse({ res, message: "successful", statusCode: StatusCode.OK, data: task })
        } catch (error) {
            return sendResponse({ res, message: "", statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
    async updatePositon(req: Request, res: Response) {
        try {
            const {
                resourceList,
                destinationList,
                resourceSectionId,
                destinationSectionId
            } = req.body;
            if (resourceSectionId !== destinationSectionId) {
                for (const key in resourceList) {
                    await Task.findByIdAndUpdate(
                        resourceList[key].id,
                        {
                            $set: {
                                section: resourceSectionId,
                                position: key
                            }
                        }
                    )
                }
            }
            for (const key in destinationList) {
                await Task.findById(
                    destinationList[key].id,
                    {
                        $set: {
                            section: destinationSectionId,
                            position: key
                        }
                    }
                )
            }
            sendResponse({ res, message: "Updated", statusCode: StatusCode.INTERNAL_SERVER_ERROR, data: {} })
        } catch (error) {
            return sendResponse({ res, message: "successful", statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
}

export default TaskController;