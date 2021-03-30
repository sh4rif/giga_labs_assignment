if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const fileUpload = require("express-fileupload");
const swaggerJSDocs = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const { sequelize } = require("./models");
const { verifyToken } = require("./middlewares");
const { serverError, notFound } = require("./middlewares");

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocs = swaggerJSDocs({
  swaggerDefinition: {
    info: {
      title: "Movie API's",
      description: "An assignment for GIGA LABS",
      contact: { name: "Muhammad Usman Sharif" },
    },
  },
  apis: ["./routes/*.js"],
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());
app.use(fileUpload());

(async () => {
  await sequelize.sync();
})();

app.use("/api/movies", verifyToken, require("./routes/movies"));

app.use(notFound);
app.use(serverError);
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`));
