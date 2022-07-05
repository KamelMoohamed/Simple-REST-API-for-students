import { Request, Response } from "express";
const CatchAsync = require("../utils/CatchAsync");
dotenv.config({ path: "./config.env" });
const pool = require("../db");

const getAllUsers = () => {
  CatchAsync(async (req: Request, res: Response, next: any) => {
    pool.query("SELECT * FROM students_data", (err: string, results: any) => {
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
      `SELECT * FROM students_data WHERE id = $1`,
      [id],
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
      `INSERT INTO students_data (name, email, password, GPA) VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, password, GPA],
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
      `UPDATE students_data SET name = $1, email = $2, password = $3, GPA = $4 WHERE id = $5`,
      [name, email, password, GPA, id],
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
      `DELETE FROM students_data WHERE id = $1`,
      [id],
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
