"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserTokens }) {
      // define association here
      this.hasMany(UserTokens, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      profile: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
