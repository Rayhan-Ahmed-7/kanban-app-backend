import { Router } from "express";
import AuthController from "../controllers/authController";
import AuthMiddleware from "../middleware/authMiddleware";
import { body } from "express-validator";
import User from "../models/user_model";
import { validate } from "../validation/authValidation";

class AuthRoutes {
    router = Router();
    controller = new AuthController();
    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            "/register",
            body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
            body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
            // body('username').custom(value => {
            //     User.findOne({ username: value }).then(user => {
            //         if (user) {
            //             return Promise.reject("user already exists with this username.")
            //         }
            //     })
            // }),
            validate,
            this.controller.register
        );
        this.router.post("/login", this.controller.login);
        this.router.get("/verify-token", this.controller.verifyToken);
        this.router.get("/users", AuthMiddleware.authenticate, this.controller.getUsers);
    }
}

export default new AuthRoutes().router;