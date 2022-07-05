"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const CatchAsync = require("../utils/CatchAsync");
const dotenv = require("dotenv");
const pool = require("../db");
dotenv.config({ path: "./config.env" });
const userToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = userToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
exports.signup = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    pool.query(`INSERT INTO USER (name, email, password) VALUES(${req.body.name}, ${req.body.email}, ${req.body.password})`, (err, results) => {
        if (err) {
            return err;
        }
        createSendToken(results, 201, res);
    });
}));
exports.login = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError("Please provide both email and password", 400));
    }
    pool.query(`SELECT * FROM USER WHERE email = ${email} AND password = ${password}`, (err, results) => {
        if (err) {
            throw err;
        }
        if (!results) {
            return next(new appError("Incorrect email or password", 401));
        }
        res.status(200).json({
            status: "success",
            data: results.rows,
        });
        createSendToken(results.rows, 200, res);
    });
}));
exports.protect = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new AppError("You aren't logged in!", 401));
    }
    const decodedData = yield promisify(jwt.verify)(token, process.env.JWT_SECRET);
    pool.query(`SELECT * FROM USER WHERE id = ${decodedData.id}`, (err, results) => {
        if (!results) {
            return next(new AppError("The token dosen't longer exist.", 401));
        }
    });
    next();
}));
