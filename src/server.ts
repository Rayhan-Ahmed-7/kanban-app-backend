import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes";


class Server {
    constructor(app: Application) {
        this.config(app);
        new Routes(app);
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: "http://localhost:5173"
        }

        app.use(express.json());
        app.use(cors(corsOptions));
        app.use(express.urlencoded({ extended: false }));
    }
}

export default Server;