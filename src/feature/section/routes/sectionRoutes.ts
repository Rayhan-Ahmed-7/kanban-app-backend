import { Router } from "express";
import SectionController from "../controller/sectionController";
import authMiddleware from "../../../middleware/authMiddleware";
import { param } from "express-validator";
import { isObjectId, validate } from "../../../utils/validate";

class SectionRoutes {
    router = Router();
    controller = new SectionController();
    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/create/:boardId",
            param('boardId').custom(value => {
                if (!isObjectId(value)) {
                    return Promise.reject("invalid board id");
                } else {
                    return Promise.resolve();
                }
            }),
            validate,
            authMiddleware.authenticate, this.controller.create);
        this.router.put("/update/:sectionId",
            param('sectionId').custom(value => {
                if (!isObjectId(value)) {
                    return Promise.reject("invalid section id");
                } else {
                    return Promise.resolve();
                }
            }),
            validate,
            authMiddleware.authenticate, this.controller.update);
        this.router.delete("/delete/:sectionId",
            param('sectionId').custom(value => {
                if (!isObjectId(value)) {
                    return Promise.reject("invalid section id");
                } else {
                    return Promise.resolve();
                }
            }),
            validate,
            authMiddleware.authenticate, this.controller.delete);
    }
}
export default new SectionRoutes().router;