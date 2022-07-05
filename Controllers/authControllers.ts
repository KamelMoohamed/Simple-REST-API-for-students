import { Request, Response } from "express";
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const CatchAsync = require("../utils/CatchAsync");
const dotenv = require("dotenv");
const pool = require("../db");

dotenv.config({ path: "./config.env" });

const userToken = (id: Number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = userToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
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

exports.signup = CatchAsync(async (req: Request, res: Response, next: any) => {
  pool.query(
    `INSERT INTO students_data (name, email, password) VALUES($1, $2, $3)`,
    [req.body.name, req.body.email, req.body.password],
    (err: string, results: string) => {
      if (err) {
        return err;
      }
      createSendToken(results, 201, res);
    }
  );
});

exports.login = CatchAsync(async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please provide both email and password", 400));
  }
  pool.query(
    `SELECT * FROM students_data WHERE email = $1 AND password = $2`,
    [email, password],
    (err: string, results: any) => {
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
    }
  );
});

exports.protect = CatchAsync(async (req: Request, res: Response, next: any) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You aren't logged in!", 401));
  }

  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  pool.query(
    `SELECT * FROM students_data WHERE id = $1`,
    [decodedData.id],
    (err: string, results: string) => {
      if (!results) {
        return next(new AppError("The token dosen't longer exist.", 401));
      }
    }
  );
  next();
});
