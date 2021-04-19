var DataTypes = require('sequelize').DataTypes;
var _posts = require('./post')
var _users = require('./users');

module.exports = function association (sequelize) {
    var posts = _posts(sequelize, DataTypes);
    var users = _users(sequelize, DataTypes)

    posts.belongsTo(users, { foreignKey: "user_id"});
    users.hasMany(posts, { foreignKey: "user_id"});

    return {
        posts,
        users
    }
}

