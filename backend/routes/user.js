const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer_config');
const auth = require('../middlewares/auth');
// const error = require('../middlewares/error');
// const passport = require('passport')
const userCtrl = require('../controllers/user');


// Incription user      => OK testé
router.post("/signup", /*error , */ multer, userCtrl.signup);

// connexion user       => OK testé
router.post("/login", userCtrl.login);

// update user
router.put('/updateUser/:id',auth, multer, userCtrl.updateUser);

// update user password
router.put('/updatePassword/:id', auth, userCtrl.updatePassword)

//delete user           => OK testé
router.delete('/delete/:id/:password', auth, userCtrl.deleteUser)

// récupérer utilisateur connecté ( pour page profil d'utilisateur )        => OK testé
router.get('/:id', auth, userCtrl.getOneUser)

// récupérer tous les utilisateur ( pour Admin)
router.get('/', auth, userCtrl.getAllUser)

// forgot password          => OK testé
router.post('/forgot', userCtrl.forgotPassword)

// reset password           => OK testé
router.patch('/reset/:token', userCtrl.resetPassword)

// route pour prendre images
// router.get('/photo', userCtrl.images)

module.exports = router;
