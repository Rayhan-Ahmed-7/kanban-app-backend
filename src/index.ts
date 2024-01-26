import expreess from "express";
import dotenv from "dotenv";

dotenv.config()


const app = expreess()
const port = process.env.PORT;


app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});