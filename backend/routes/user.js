const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer_config');
const auth = require('../middlewares/auth');
const error = require('../middlewares/error');

const userCtrl = require('../controllers/user');


// Incription user
router.post("/signup", /*userCtrl.multerPrevent*/  multer, userCtrl.signup);

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

// forgot password
router.post('/forgot', userCtrl.forgotPassword)

// reset password
router.patch('/reset/:token', userCtrl.resetPassword)

module.exports = router;
