// modele table Users
'use strict';

const db = require('../server'); // fichier où se trouve l'instance sequelize

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const users = sequelize.define(
      "Users", {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        nom: {
          allowNull: false,
          type: DataTypes.STRING
        },
        prenom: {
          allowNull: false,
          type: DataTypes.STRING
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING,
          primaryKey: true,
        },
        password: {
          allowNull: false,
          type: DataTypes.STRING
        },
        fonction: {
          allowNull: true,
          type: DataTypes.STRING
        },
        pseudo: {
          allowNull: false,
          type: DataTypes.STRING,
          primaryKey: true,
        },
        avatar: {
          allowNull: true,
          type: DataTypes.STRING
        },
        isAdmin: {
          allowNull: false,
          type: DataTypes.BOOLEAN
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        createPasswordResetToken: {
          allowNull:true,
          type: DataTypes.STRING,
        },
      }, 
      {
        sequelize,
        tableName: "users",
        timeStamps: true,
        indexes: [
          {name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
          },
          {
            name: "email",
            unique: true,
            using: "BTREE",
            fields: [{ name: "email" }],
          },
          {
            name: "pseudo",
            unique: true,
            using: "BTREE",
            fields: [{ name: "pseudo" }],
          },
        ]
      }
    );
    return users
}


