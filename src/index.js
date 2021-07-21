const express = require("express");
const cors = require("cors");
const { port } = require("./config");

const auth = require("./routes/v1/auth");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.use("/v1/auth/", auth);

app.all("*", (req, res) => {
  res.status(404).send({ error: "Page not found" });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
