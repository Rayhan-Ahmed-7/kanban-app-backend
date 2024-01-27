import expreess, { Request, Response } from "express";
import dotenv from "dotenv";
import Server from "./server";

dotenv.config()


const app = expreess();
const server: Server = new Server(app);
const port = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
})
    .on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
            console.log("Error: address already in use");
        } else {
            console.log(err);
        }
    });