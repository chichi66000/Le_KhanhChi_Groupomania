'use strict';

// const db = require('../server'); // fichier où se trouve l'instance sequelize
const Sequelize = require('sequelize');
// const database = require('./index');
module.exports = (sequelize, DataTypes) => {
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
        type: DataTypes.STRING(50)
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
            name: "fk_userId",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
    }
  );
  return posts
  
};

