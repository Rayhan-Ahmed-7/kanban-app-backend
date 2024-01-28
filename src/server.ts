import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes";
import cookieParser from "cookie-parser";
import db from "./config/db";


class Server {
    constructor(app: Application) {
        this.config(app);
        new Routes(app);
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: "http://localhost:5173",
            credentials: true
        }

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(cookieParser());
        app.use(express.urlencoded({ extended: false }));

        db.connect();
    }
}

export default Server;