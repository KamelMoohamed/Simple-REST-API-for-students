"use strict";
const express = require("express");
const userController = require("./../Controllers/userController");
const router = express.Router();
router
    .route("/")
    .post(userController.createUser)
    .get(userController.getAllUsers);
router
    .route("/:id")
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);
module.exports = router;
