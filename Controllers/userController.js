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
const CatchAsync = require("../utils/CatchAsync");
const Pool = require("pg").Pool;
dotenv.config({ path: "./config.env" });
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "students",
    password: process.env.PASSWORD || "123456789",
    port: 5432,
});
const getAllUsers = () => {
    CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        pool.query("SELECT * FROM USER", (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                status: "success",
                data: results.rows,
            });
        });
    }));
};
const getUserById = () => {
    CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        pool.query(`SELECT * FROM USER WHERE id = ${id}`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                status: "success",
                data: results.rows,
            });
        });
    }));
};
const createUser = () => CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, GPA } = req.body;
    pool.query(`INSERT INTO USER (name, email, password, GPA) VALUES (${name}, ${email}, ${password} ,${GPA}) RETURNING id`, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(201).json({
            status: "success",
        });
    });
}));
const updateUser = () => {
    CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const { name, email, password, GPA } = req.body;
        pool.query(`UPDATE USER SET name = ${name}, email = ${email}, password = ${password}, GPA = ${GPA} WHERE id = ${id}`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).send(`success`);
        });
    }));
};
const deleteUser = () => {
    CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        pool.query(`DELETE FROM USER WHERE id = ${id}`, (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).send(`success deleting user`);
        });
    }));
};
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
