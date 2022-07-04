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
  CatchAsync(async (req, res, next) => {
    pool.query("SELECT * FROM USER", (err, results) => {
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
  CatchAsync(async (req, res, next) => {
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
  });
};

const createUser = () =>
  CatchAsync(async (req, res, next) => {
    const { name, email, GPA } = request.body;
    pool.query(
      `INSERT INTO USER (name, email, GPA) VALUES (${name}, ${email}, ${GPA}) RETURNING id`,
      (err, results) => {
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
  CatchAsync(async (req, res, next) => {
    const id = parseInt(request.params.id);
    const { name, email, GPA } = request.body;

    pool.query(
      `UPDATE USER SET name = ${name}, email = ${email}, GPA = ${GPA} WHERE id = ${id}`,
      (err, results) => {
        if (err) {
          throw err;
        }
        response.status(200).send(`success`);
      }
    );
  });
};

const deleteUser = () => {
  CatchAsync(async (req, res, next) => {
    const id = parseInt(request.params.id);

    pool.query(`DELETE FROM USER WHERE id = ${id}`, (err, results) => {
      if (err) {
        throw err;
      }
      response.status(200).send(`success deleting user`);
    });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
