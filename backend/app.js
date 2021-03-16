const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

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

const app = express();

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

// Créer connexion avec mysql
// var mysql = require('mysql')
// var connection = mysql.createConnection({
// host: 'localhost',
// user: 'utilisateurdb',
// password: 'secret',
// database: 'ma_db' })

// connection.connect()

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

module.exports = app;
