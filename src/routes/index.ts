import { Application } from "express";
import authRoutes from "./authRoutes";

class Routes {
    constructor(app: Application) {
        app.use("/api/auth", authRoutes);
    }
}

export default Routes;