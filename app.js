const express = require("express");
const userRoutes = require("./Routes/userRoutes");

const app = express();

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    massage: "welcome to our new website",
  });
});

module.exports = app;
