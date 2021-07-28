const express = require("express");
const mysql = require("mysql2/promise");
const { mysqlConfig } = require("../../config");
const { isLoggedIn } = require("../../middleware");

const router = express.Router();

router.get("/all-todos", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `SELECT * FROM todos WHERE todos.user_id = '${req.user.id}'`
    );

    con.end();

    if (data.length === 0) {
      return res.send({ message: "You have no tasks to do" });
    }

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.post("/add-todo", isLoggedIn, async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ error: "Incorrect data passed" });
  }

  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `INSERT INTO todos (title, user_id) VALUES (${mysql.escape(
        req.body.title
      )}, ${req.user.id})`
    );

    con.end();

    if (data.affectedRows !== 1) {
      return res.status(500).send({
        error: "An unexpected error occurred. Please try again later",
      });
    }

    return res.status(200).send({ message: "You succesfully added a task" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.get("/today", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `SELECT * FROM todos WHERE DATE(todos.due_date) = CAST(NOW() AS DATE) AND todos.user_id =${req.user.id}`
    );

    con.end();

    if (data.length === 0) {
      return res.send({ message: "You have no tasks to do today" });
    }

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.get("/important", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `SELECT * FROM todos WHERE todos.important = true AND todos.user_id = ${req.user.id}`
    );

    con.end();

    if (data.length === 0) {
      return res.send({ message: "You have no important tasks" });
    }

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.get("/planned", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `SELECT * FROM todos WHERE todos.due_date != CURRENT_DATE AND todos.user_id = ${req.user.id}`
    );

    con.end();

    if (data.length === 0) {
      return res.send({ message: "You have no planned tasks" });
    }

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.post("/set-important", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [result] = await con.execute(
      `UPDATE todos SET todos.important=true WHERE todos.id = ${Number(
        mysql.escape(req.body.id)
      )} AND todos.user_id = ${req.user.id}`
    );

    con.end();

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.post("/unset-important", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [result] = await con.execute(
      `UPDATE todos SET todos.important=false WHERE todos.id = ${Number(
        mysql.escape(req.body.id)
      )} AND todos.user_id = ${req.user.id}`
    );

    con.end();

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.post("/set-complete", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [result] = await con.execute(
      `UPDATE todos SET todos.complete=true WHERE todos.id = ${Number(
        mysql.escape(req.body.id)
      )} AND todos.user_id = ${req.user.id}`
    );

    con.end();

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

router.post("/unset-complete", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [result] = await con.execute(
      `UPDATE todos SET todos.complete=false WHERE todos.id = ${Number(
        mysql.escape(req.body.id)
      )} AND todos.user_id = ${req.user.id}`
    );

    con.end();

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An unexpected error occured. Please try again later" });
  }
});

module.exports = router;
