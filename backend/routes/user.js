const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer_config');
const auth = require('../middlewares/auth');
const db = require('../models/users');
const sequelize = require('sequelize')

const userCtrl = require('../controllers/user');

router.get("/test", (req, res) => res.send("testok")
)

// Incription user
router.post("/signup", multer, userCtrl.signup);

// connexion user
router.post("/login", userCtrl.login);

// update user
router.put('/:id',auth, multer, userCtrl.updateUser);

//delete user
router.post('/:id', auth, userCtrl.deleteUser)

module.exports = router;
