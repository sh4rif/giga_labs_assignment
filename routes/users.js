const express = require("express");
const yupObj = require("yup");

const router = express.Router();

const UserController = require("../controllers/UserController");
const { validateAuht } = require("../middlewares");
const yup_obj_email = yupObj.object().shape(
  {
    email: yupObj.string().email().required(),
    password: yupObj.string().required(),
  },
  { abortEarly: false }
);

router.post("/register", validateAuht(yup_obj_email), UserController.register);
router.post("/login", validateAuht(yup_obj_email), UserController.login);
router.post("/token", UserController.getNewAccessToken);
router.delete("/logout", UserController.logout);

module.exports = router;
