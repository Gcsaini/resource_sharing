import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./users.js";

const Resource = sequelize.define("resources", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: "id" } },
  resource_url: { type: DataTypes.STRING, allowNull: false },
  expiration_time: { type: DataTypes.DATE, allowNull: false },
  access_token: { type: DataTypes.STRING, allowNull: false, unique: true },
  is_expired: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export default Resource;
