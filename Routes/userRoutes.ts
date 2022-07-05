const express = require("express");
const userController = require("./../Controllers/userController");
const authControllers = require("./authControllers");

const router = express.Router();

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route("/:id")
  .get(authControllers.protect, userController.getUser)
  .delete(authControllers.protect, userController.deleteUser)
  .patch(authControllers.protect, userController.updateUser);

module.exports = router;
