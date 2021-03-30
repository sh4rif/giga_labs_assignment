if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

const { sequelize } = require("./models");
const { serverError, notFound } = require("./middlewares");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

(async () => {
  await sequelize.sync();
})();

app.use("/api/accounts", require("./routes/users"));

app.use(notFound);
app.use(serverError);
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`));
