import expreess, { Request, Response } from "express";
import Server from "./server";
import AppCredentials from "./helper/credentials";




const app = expreess();
const server: Server = new Server(app);
const port = AppCredentials.PORT;

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