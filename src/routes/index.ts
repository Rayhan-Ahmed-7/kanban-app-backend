import { Application } from "express";
import authRoutes from "../feature/auth/routes/authRoutes";
import userRoutes from "../feature/user/routes/userRoutes";
import boardRoutes from "../feature/board/routes/boardRoutes";
import sectionRoutes from "../feature/section/routes/sectionRoutes";

class Routes {
    constructor(app: Application) {
        app.use("/api/auth", authRoutes);
        app.use("/api/auth", userRoutes);
        app.use("/api/board", boardRoutes);
        app.use("/api/section", sectionRoutes);
    }
}

export default Routes;