import { Router } from "express";
import TaskController from "../controller/taskController";
import { param } from "express-validator";
import { isObjectId, validate } from "../../../utils/validate";
import authMiddleware from "../../../middleware/authMiddleware";

class TaskRoutes {
    router = Router();
    controller = new TaskController();

    constructor() {
        this.initializeRoutes()
    }
    initializeRoutes() {
        this.router.post(
            '/create/:sectionId',
            param('sectionId').custom(value => {
                if (!isObjectId(value)) {
                    return Promise.reject("Section id is invalid.")
                } else {
                    return Promise.resolve();
                }
            }),
            validate,
            authMiddleware.authenticate,
            this.controller.create
        )
        this.router.put(
            '/update/:taskId',
            param('taskId').custom(value => {
                if (!isObjectId(value)) {
                    return Promise.reject("Task id is invalid.")
                } else {
                    return Promise.resolve();
                }
            }),
            validate,
            authMiddleware.authenticate,
            this.controller.update
        )
        this.router.put(
            '/update-position',
            authMiddleware.authenticate,
            this.controller.updatePositon
        )
        this.router.delete(
            '/delete/:taskId',
            param('taskId').custom(value => {
                if (!isObjectId(value)) {
                    return Promise.reject("Task id is invalid.")
                } else {
                    return Promise.resolve();
                }
            }),
            validate,
            authMiddleware.authenticate,
            this.controller.delete
        )
    }
}

export default new TaskRoutes().router;