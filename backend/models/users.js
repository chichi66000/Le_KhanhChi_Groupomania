'use strict';
// const {
//   Model
// } = require('sequelize');
const db = require('../server'); // fichier où se trouve l'instance sequelize
// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = new Sequelize();

// class User extends Model {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  //  static associate(models) {
    // define association here
    // }
// }

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
          unique: "email"
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
          unique: "pseudo"
        },
        avatar: {
          allowNull: true,
          type: DataTypes.TEXT
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
        }
      }, {
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


