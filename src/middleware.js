const Joi = require("joi");

const userSchema = Joi.object({
  first_name: Joi.string().min(2).max(255).trim(),
  email: Joi.string().email().max(255).trim().lowercase(),
  password: Joi.string().min(6).max(255),
});

module.exports = {
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
