const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
}

const notFound = (req, res, next) => {
  res.status(404).json({ message: "Sorry can't find that route!" });
};

const serverError = (err, req, res, next) => {
  if (!err.status) {
    console.error(err.stack);
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error!" });
};

function validateAuht(schema) {
  return async (req, res, next) => {
    try {
      const validatedBoyd = await schema.validate(req.body, {
        abortEarly: false,
      });
      req.body = validatedBoyd;
      next();
    } catch (err) {
      console.log("Errors:", err);
      const errors = [];
      err.inner.forEach((e) => {
        errors.push({
          name: e.path,
          message: e.message,
        });
      });
      res.status(400).json(errors);
    }
  };
}

module.exports = {
  verifyToken,
  notFound,
  serverError,
  validateAuht,
};
