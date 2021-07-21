const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const { isAuthDataCorrect } = require("../../middleware");
const { mysqlConfig, jwtSecretKey } = require("../../config");

router.post("/register", isAuthDataCorrect, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const hashedPassword = bcrypt.hashSync(req.userData.password, 10);

    const [data] = await con.execute(
      `INSERT INTO users (first_name, email, password) VALUES (${mysql.escape(
        req.body.firstname
      )},${mysql.escape(req.userData.email)}, '${hashedPassword}')`
    );

    con.end();

    if (data.affectedRows !== 1) {
      return res
        .status(500)
        .send({ error: "An unexpected error occured. Please try again" });
    }

    return res.send({ message: "Succesfully registered account" });
  } catch (err) {
    if (err.message.toLowerCase().includes("dup")) {
      return res.status(500).send({ error: "Email is already in use" });
    }
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again" });
  }
});

router.post("/login", isAuthDataCorrect, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `SELECT * FROM users WHERE email = ${mysql.escape(req.userData.email)}`
    );

    if (data.length === 0) {
      return res.status(400).send({ error: "Email or password is incorrect" });
    }

    const validPassword = bcrypt.compareSync(
      req.userData.password,
      data[0].password
    );

    if (!validPassword) {
      return res.status(400).send({ error: "Email or password is incorrect" });
    }

    const token = jwt.sign(
      { id: data[0].id, email: data[0].email },
      jwtSecretKey
    );

    return res.send({ message: "You have successfully logged in", token });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again" });
  }
});

module.exports = router;
