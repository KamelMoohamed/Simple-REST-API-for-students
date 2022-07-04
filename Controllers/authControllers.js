const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
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

const userToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = userToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
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

exports.signup = CatchAsync(async (req, res, next) => {
  pool.query(
    `INSERT INTO USER (name, email, password) VALUES(${req.body.name}, ${req.body.email}, ${req.body.password})`,
    (err, results) => {
      if (err) {
        return err;
      }
      createSendToken(results, 201, res);
    }
  );
});

exports.login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please provide both email and password", 400));
  }
  pool.query(
    `SELECT * FROM USER WHERE email = ${email} AND password = ${password}`,
    (err, results) => {
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

exports.protect = CatchAsync(async (req, res, next) => {
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
    `SELECT * FROM USER WHERE id = ${decodedData.id}`,
    (err, results) => {
      if (!results) {
        return next(new AppError("The token dosen't longer exist.", 401));
      }
    }
  );

  req.user = results.rows;

  next();
});
