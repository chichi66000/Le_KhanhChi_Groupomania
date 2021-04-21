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
        if (req.files) {
            // console.log(req.files);     //OK
            for (let i=0; i<req.files.length; i++) {
                file_url += (req.files[i].filename)+ ", "
            }
            // console.log(file_url);          //OK
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

// route pour récupérer tous les publications
exports.getAllPosts = (req, res) => {
    console.log("OKKKK");
}