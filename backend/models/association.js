var DataTypes = require('sequelize').DataTypes;
var _posts = require('./post')
var _users = require('./users');
var _likes = require('./likes');
var _commentaires = require('./commentaires');


function association (sequelize) {
    var posts = _posts(sequelize, DataTypes);
    var users = _users(sequelize, DataTypes);
    var likes = _likes(sequelize, DataTypes);
    var commentaires = _commentaires(sequelize, DataTypes);

    // relation entre user et posts
    posts.belongsTo(users, { foreignKey: "userId"});
    users.hasMany(posts, { foreignKey: "userId"});

    // relation entre user et commentaires
    commentaires.belongsTo(users, { foreignKey: "fk_commentaires_userId"});
    users.hasMany(commentaires, { foreignKey: "fk_commentaires_userId"});
    
    // relation entre user et likes
    likes.belongsTo(users, { foreignKey: "fk_likes_userId"});
    users.hasMany(likes, { foreignKey: "fk_likes_userId"});

    // relation entre post et commentaires
    commentaires.belongsTo(posts, { foreignKey: "fk_commentaires_postId"});
    posts.hasMany(commentaires, { foreignKey: "fk_commentaires_postId"});

    // relation entre post et likes
    likes.belongsTo(posts, { foreignKey: "fk_likes_postId"});
    posts.hasMany(likes, { foreignKey: "fk_likes_postId"});

    return {
        posts,
        users,
        likes,
        commentaires
    }
}

module.exports = association;
module.exports.association = association;
module.exports.default = association;