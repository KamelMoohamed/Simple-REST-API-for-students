import express, { Express, Request, Response } from "express";
const userRoutes = require("./Routes/userRoutes");

const app: Express = express();

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/", (req: Request, res: Response, next) => {
  res.status(200).json({
    status: "success",
    massage: "welcome to our new website",
  });
});

module.exports = app;
