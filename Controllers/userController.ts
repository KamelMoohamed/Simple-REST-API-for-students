import { Request, Response } from "express";
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
  CatchAsync(async (req: Request, res: Response, next: any) => {
    pool.query("SELECT * FROM USER", (err: string, results: any) => {
      if (err) {
        throw err;
      }
      res.status(200).json({
        status: "success",
        data: results.rows,
      });
    });
  });
};

const getUserById = () => {
  CatchAsync(async (req: Request, res: Response, next: any) => {
    const id = parseInt(req.params.id);

    pool.query(
      `SELECT * FROM USER WHERE id = ${id}`,
      (err: string, results: any) => {
        if (err) {
          throw err;
        }
        res.status(200).json({
          status: "success",
          data: results.rows,
        });
      }
    );
  });
};

const createUser = () =>
  CatchAsync(async (req: Request, res: Response, next: any) => {
    const { name, email, password, GPA } = req.body;
    pool.query(
      `INSERT INTO USER (name, email, password, GPA) VALUES (${name}, ${email}, ${password} ,${GPA}) RETURNING id`,
      (err: string, results: any) => {
        if (err) {
          throw err;
        }
        res.status(201).json({
          status: "success",
        });
      }
    );
  });

const updateUser = () => {
  CatchAsync(async (req: Request, res: Response, next: any) => {
    const id = parseInt(req.params.id);
    const { name, email, password, GPA } = req.body;

    pool.query(
      `UPDATE USER SET name = ${name}, email = ${email}, password = ${password}, GPA = ${GPA} WHERE id = ${id}`,
      (err: string, results: any) => {
        if (err) {
          throw err;
        }
        res.status(200).send(`success`);
      }
    );
  });
};

const deleteUser = () => {
  CatchAsync(async (req: Request, res: Response, next: any) => {
    const id = parseInt(req.params.id);

    pool.query(
      `DELETE FROM USER WHERE id = ${id}`,
      (err: string, results: any) => {
        if (err) {
          throw err;
        }
        res.status(200).send(`success deleting user`);
      }
    );
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
