const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer_config');
const auth = require('../middlewares/auth');

//import model 
// let model = require('../models')
// const Users = model.Users;
// const sequelize = require('sequelize');
// const db = require('../server');

const userCtrl = require('../controllers/user');


// Incription user
router.post("/signup", multer, userCtrl.signup);

// connexion user
router.post("/login", userCtrl.login);

// update user
router.put('/:id',auth, multer, userCtrl.updateUser);

//delete user
router.delete('/:id', auth, userCtrl.deleteUser)

// récupérer utilisateur connecté ( pour page profil d'utilisateur )
router.get('/:id', auth, userCtrl.getOneUser)

// récupérer tous les utilisateur ( pour Admin)
router.get('/', auth, userCtrl.getAllUser)

module.exports = router;
