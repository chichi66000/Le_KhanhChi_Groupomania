const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer_config');

const postCtrl = require('../controllers/post');

// créer 1 post
router.post('/', auth, multer, postCtrl.createPost)




module.exports = router


