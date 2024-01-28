import { Router } from "express";
import AuthController from "../controllers/authController";
import AuthMiddleware from "../middleware/authMiddleware";

class AuthRoutes {
    router = Router();
    controller = new AuthController();
    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/register", this.controller.register);
        this.router.post("/login", this.controller.login);
        this.router.get("/users", AuthMiddleware.authenticate, this.controller.getUsers);
    }
}

export default new AuthRoutes().router;