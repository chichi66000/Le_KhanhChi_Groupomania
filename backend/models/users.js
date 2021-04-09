'use strict';
const crypto = require ('crypto')

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
          //attribuer la valeur resetTokenHash pour colonne;retourne resetToken pour envoyer par email
          // get () {
          //   const resetToken = crypto.randomBytes(32).toString('hex');
          //   resetToken = this.getDataValue('createPasswordResetToken');
          //   return resetToken;
          // },
          // set (resetToken) {
            
          //   const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
          //   this.setDataValue('createPasswordResetToken', resetTokenHash)
          //   console.log( {resetToken})
          //   console.log(createPasswordResetToken);
            
          // }
        },
        passwordResetExpires: {
          allowNull: true,
          type: DataTypes.DATE,
          // attribuer la valeur pour la colonne, expires dans 2h
          // set () {
          //   const expires = Date.now() + 2*60*60*1000;
          //   this.setDataValue('passwordResetExpires', expires )
          // }
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
    // function createToken () {
    //   const resetToken = crypto.randomBytes(32).toString('hex');
    //   const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
    //   this.Users.createPasswordResetToken = resetTokenHash
    //   console.log( {resetToken})
    //   console.log(createPasswordResetToken);
    //   const expires = Date.now() + 2*60*60*1000;
    //   this.Users.passwordResetExpires= expires 
    //   return resetToken
    // };
    // createToken()
    return users
}


