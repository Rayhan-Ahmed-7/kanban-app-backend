import expreess, { Request, Response } from "express";
import Server from "./server";
import AppCredentials from "./helper/credentials";
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = expreess();
const server: Server = new Server(app);
const port = AppCredentials.PORT;
// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Task Flow API",
    version: "1.0.0",
    description: "API documentation for the Task Flow application",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./src/routes/index.ts"], // Path to the API docs
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app
  .listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
module.exports = app;
