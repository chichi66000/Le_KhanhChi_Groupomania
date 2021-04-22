const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer_config');

const postCtrl = require('../controllers/posts');

// créer 1 post
router.post('/', auth, multer, postCtrl.createPost)

// récupérer tous les publications
router.get('/', auth, postCtrl.getAllPosts)





module.exports = router


