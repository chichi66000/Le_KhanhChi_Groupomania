const fs = require('fs');
const xss = require('xss')
const validator = require('validator')
const sequelize = require('sequelize');
const db = require('../models');
const Op = require( 'sequelize');
const Sequelize = require("sequelize");
const association = require('../models/association')


// route pour créer 1 post
exports.createPost = (req, res) => {
    let file_url = "";
    let regex = /[@&"()!_$*€£`+=\/;?#]+$/;
    
    // valider les entrées du req 
    if (validator.matches(req.body.title, regex)) {
        res.status(400).json("Veuillez ne pas utiliser les characters spéciaux")
    }
    else {
        // s'il y a req file, enregistrer son URL; 
        if (req.file) {
            file_url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
            console.log(file_url);
            console.log(req.file.mimetype);
        }
        else { file_url = ""};
        // enregistrer dans table Posts
        const post = db.Posts.create({
            title: xss(req.body.title),
            content: xss(req.body.content),
            img_url: file_url,
            userId: req.body.userId
        })
            .then( () => res.status(201).json("Votre article a été enregistré"))
            .catch( err => {
                console.log(err);
                res.status(500).json("Créer post erreur")
            })
    }
}