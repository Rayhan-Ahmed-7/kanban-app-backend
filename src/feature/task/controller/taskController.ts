import { Request, Response } from "express";
import Task from "../models/task_model";
import { sendResponse } from "../../../helper/global_response";
import { StatusCode } from "../../../types/util";
import Section from "../../section/model/section_model";

class TaskController {
    async create(req: Request, res: Response) {
        try {
            const { sectionId } = req.params;
            const section = await Section.findById(sectionId)
            const tasksCount = await Task.find({ section: sectionId }).countDocuments();
            let task = await Task.create({
                section: sectionId,
                position: tasksCount > 0 ? tasksCount : 0
            });
            (task as any)._doc.section = section
            return sendResponse({ res, message: "successful", statusCode: StatusCode.OK, data: task })
        } catch (error) {
            return sendResponse({ res, statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
    async update(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
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
            const { taskId } = req.params;
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
            // console.log(resourceList,destinationList,resourceSectionId,destinationSectionId)
            if (resourceSectionId !== destinationSectionId) {
                for (const key in resourceList) {
                    await Task.findByIdAndUpdate(
                        resourceList[key]._id,
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
                await Task.findByIdAndUpdate(
                    destinationList[key]._id,
                    {
                        $set: {
                            section: destinationSectionId,
                            position: key
                        }
                    }
                )
            }
            sendResponse({ res, message: "Updated", statusCode: StatusCode.OK, data: {} })
        } catch (error) {
            console.log(error);
            return sendResponse({ res, message: "error", statusCode: StatusCode.INTERNAL_SERVER_ERROR, error: error })
        }
    }
}

export default TaskController;