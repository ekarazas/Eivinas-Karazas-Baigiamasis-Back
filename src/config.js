require("dotenv").config();

module.exports = {
  port: process.env.PORT || 8080,
  mysqlConfig: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
