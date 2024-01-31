import { Application } from "express";
import authRoutes from "../feature/auth/routes/authRoutes";
import userRoutes from "../feature/user/routes/userRoutes";

class Routes {
    constructor(app: Application) {
        app.use("/api/auth", authRoutes);
        app.use("/api/auth", userRoutes);
    }
}

export default Routes;