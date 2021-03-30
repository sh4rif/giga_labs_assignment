"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id" });
    }
  }
  UserTokens.init(
    {
      user_id: DataTypes.INTEGER(11),
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserTokens",
      tableName: "user_tokens",
    }
  );
  return UserTokens;
};
