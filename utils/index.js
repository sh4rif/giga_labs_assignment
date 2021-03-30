const jwt = require("jsonwebtoken");
const snakeCase = (string) => {
  return (
    string &&
    string
      .replace(/\d+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join("_")
  );
};

const create_filename = (title) => {
  return Date.now().toString() + "_" + snakeCase(title);
};

const get_file_extension = (filename) => filename.split(".").pop();

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}

module.exports = {
  snakeCase,
  get_file_extension,
  create_filename,
  generateAccessToken,
};
