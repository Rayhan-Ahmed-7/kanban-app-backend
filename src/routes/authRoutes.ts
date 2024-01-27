import { Router } from "express";
import AuthController from "../controllers/authController";

class AuthRoutes {
    router = Router();
    controller = new AuthController();
    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("register", this.controller.register);
        this.router.post("login", this.controller.register);
    }
}

export default new AuthRoutes().router;