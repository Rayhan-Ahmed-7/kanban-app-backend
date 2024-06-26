import { Router } from "express";
import authMiddleware from "../../../middleware/authMiddleware";
import UserController from "../controllers/userController";

class UserRoutes {
    router = Router();
    controller = new UserController();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/users", authMiddleware.authenticate, this.controller.getUsers);
    }
}

export default new UserRoutes().router;