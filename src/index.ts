import expreess, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config()


const app = expreess()
const port = process.env.PORT;

app.use(expreess.json())

app.get("/", (req: Request, res: Response) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});