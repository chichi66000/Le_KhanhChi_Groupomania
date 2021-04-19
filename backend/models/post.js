const db = require('../server'); // fichier où se trouve l'instance sequelize
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const posts = sequelize.define(
      "Posts", {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          allowNull: true,
          type: DataTypes.STRING(100)
        },
        content: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
        },
        img_url: {
          allowNull: true,
          type: DataTypes.STRING(255)
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
      }, 
      {
        sequelize,
        tableName: "posts",
        timeStamps: true,
        indexes: [
            {
              name: "PRIMARY",
              unique: true,
              using: "BTREE",
              fields: [{ name: "id" }],
            },
            {
              name: "id",
              unique: true,
              using: "BTREE",
              fields: [{ name: "id" }],
            },
            {
              name: "user_id",
              using: "BTREE",
              fields: [{ name: "user_id" }],
            },
          ],
      }
    );
    return posts
}
