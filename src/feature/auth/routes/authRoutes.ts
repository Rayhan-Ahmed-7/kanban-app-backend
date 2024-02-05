import { Router } from "express";
import AuthController from "../controllers/authController";
import { validate } from "../../../utils/validate";
import { authValidation } from "../validation/authValidation";

class AuthRoutes {
    router = Router();
    controller = new AuthController();
    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            "/register",
            authValidation,
            validate,
            this.controller.register
        );
        this.router.post("/login", this.controller.login);
        this.router.get("/verify-token", this.controller.verifyToken);
        this.router.get("/refresh-token", this.controller.refreshToken);
    }
}

export default new AuthRoutes().router;