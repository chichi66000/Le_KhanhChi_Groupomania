const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

const userRoutes = require('./routes/user');

// pour une protection api
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
});
require('dotenv').config(); // load .env file pour garder secret les infos confidentiels
const expressSanitizer = require('express-sanitizer');

// setHeader
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
    next();
})
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({origin: 'http://localhost:8080'}));
app.use(limiter);
app.use (expressSanitizer());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use('./api/auth', userRoutes);



module.exports = app;
