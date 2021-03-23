const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer_config');
const auth = require('../middlewares/auth');

let model = require('../models')
const Users = model.Users;
const sequelize = require('sequelize');
const db = require('../server');

const userCtrl = require('../controllers/user');

router.get("/test", (req, res) => {
    const data = {
        nom: "Chi",
        prenom: "Le",
        email: "le.chi@yahoo.com",
        password:"0123456789",
        pseudo: "lechi",
        fonction: "",
        avatar: "",
        isAdmin: "1",
    };
    let { nom, prenom, email, password, pseudo, fonction, avatar, isAdmin} = data;
    Users.create( {
        nom,
        prenom,
        email,
        password,
        pseudo, 
        fonction,
        avatar,
        isAdmin
    })
        .then(user => console.log(user))
        .catch((error) => console.log(error))
})


// Incription user
router.post("/signup", multer, userCtrl.signup);

// connexion user
router.post("/login", userCtrl.login);

// update user
router.put('/:id',auth, multer, userCtrl.updateUser);

//delete user
router.post('/:id', auth, userCtrl.deleteUser)

module.exports = router;
