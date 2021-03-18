const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer_config');

const userCtrl = require('../controllers/user');

// Incription user
router.post("/signup", multer, userCtrl.signup);
// connexion user
router.post("/login", userCtrl.login);

module.exports = router;
