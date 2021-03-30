const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, UserTokens } = require("../models");
const { generateAccessToken } = require("../utils");

class UserController {
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      // check if user is exists with the provided email
      const user = await User.findOne({
        where: { email },
        attributes: ["id", "email", "password"],
      });
      if (!user) {
        return res.status(400).send("Cannot find user");
      }

      //if password not matched return 400 response
      if ((await bcrypt.compare(password, user.password)) !== true) {
        return res.status(400).send("Not Found");
      }

      const userObj = { id: user.id, email: user.email };

      const accessToken = await generateAccessToken(userObj);

      const oldRefreshToken = await UserTokens.findOne({
        where: { user_id: user.id },
      });
      let refreshToken;
      if (oldRefreshToken) {
        refreshToken = oldRefreshToken.token;
      } else {
        refreshToken = await jwt.sign(
          userObj,
          process.env.REFRESH_TOKEN_SECRET
        );
        UserTokens.create({ user_id: user.id, token: refreshToken });
      }

      return res.json({ accessToken, refreshToken });
    } catch (err) {
      console.log("err", err);
      return res.status(500).json(err);
    }
  }

  static async logout(req, res) {
    const token = req.body.token;
    if (!token) return res.sendStatus(401);

    try {
      await UserTokens.destroy({ where: { token } });

      res.sendStatus(204);
    } catch (error) {
      console.log("error", error);
      return res.sendStatus(403);
    }
  }

  static async getNewAccessToken(req, res) {
    const token = req.body.token;
    if (!token) return res.sendStatus(401);

    try {
      const user = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const savedToken = await UserTokens.findOne({
        where: { user_id: user.id, token },
      });
      if (!savedToken) return res.sendStatus(403);

      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
      });

      res.json({ accessToken });
    } catch (error) {
      console.log("error", error);
      return res.sendStatus(403);
    }
  }

  static async register(req, res) {
    const { name, email, password, phone, profile } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      const hashedPwd = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPwd, phone, profile });
      res.status(201).json({ message: "User Registered!" });
    } catch (error) {
      console.log("error", error);
      res.status(500).json(err);
    }
  }
}
module.exports = UserController;
