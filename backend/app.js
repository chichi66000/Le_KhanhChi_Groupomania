// import les modules nécessaires pour serveur
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser')
const app = express();


//import les modules pour une protection api
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
});
const expressSanitizer = require('express-sanitizer');

// load .env file pour garder secret les infos confidentiels
require('dotenv').config(); 

// setHeader
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
})

// utiliser le cookie-parser
app.use(cookieParser())

// parse requests of content-type - application/json
app.use(cors({origin: 'http://localhost:8080'}, {credentials: true}));

app.use(helmet());
app.use(limiter);
app.use (expressSanitizer());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// imports les routes user et post

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');

//route authentification pour la gestion des utilisateurs
app.use('/api/auth', userRoutes);

// route pour la gestion des posts d'actualités
app.use('/api/post', postRoutes )

// route pour stocker les images
app.use("/images", express.static(path.join(__dirname, "images")));



module.exports = app;
