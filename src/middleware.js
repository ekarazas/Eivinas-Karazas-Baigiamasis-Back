const jwt = require("jsonwebtoken");
const Joi = require("joi");

const { jwtSecretKey } = require("./config");

const userSchema = Joi.object({
  first_name: Joi.string().min(2).max(255).trim(),
  email: Joi.string().email().max(255).trim().lowercase(),
  password: Joi.string().min(6).max(255),
});

module.exports = {
  isLoggedIn(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, jwtSecretKey);
      req.user = decodedToken;
      return next();
    } catch (err) {
      return res
        .status(400)
        .send({ error: "Unauthorized access to site. Please Login" });
    }
  },
  async isAuthDataCorrect(req, res, next) {
    let userData;
    try {
      userData = await userSchema.validateAsync({
        first_name: req.body.first_name,
        email: req.body.email,
        password: req.body.password,
      });
      req.userData = userData;
      return next();
    } catch (e) {
      return res.status(400).send({ error: "Incorrect data passed" });
    }
  },
};
