const fs = require('fs');
const xss = require('xss')
const validator = require('validator')

const db = require('../models')
const Sequelize = require('sequelize');
const association = require('../models/association').association
const sequelize = require('../models/index').sequelize;
const models = association(sequelize);
// const Op = require( sequelize);

// const { json } = require("sequelize");



// route pour créer 1 post
exports.createPost = (req, res) => {
    let file_url = "";
    let regex = /[@&"()_$*€£`+=\/;#]+$/;
    
    // valider les entrées du req 
    if (validator.matches(req.body.title, regex)) {
        res.status(400).json("Veuillez ne pas utiliser les characters spéciaux")
    }
    else {
        // s'il y a req file, enregistrer son URL; 
        if (req.files) {
            // console.log(req.files);     //OK
            for (let i=0; i<req.files.length; i++) {
                file_url += (req.files[i].filename)+ " "        //séparer les noms avec espace
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
    models.posts
      .findAll({
        include: [ models.likes, models.commentaires],
        order: [["id", "DESC"]],
      })
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((error) => res.status(500).json(error));
    // console.log("OKKKK");
  };

exports.updatePost = (req, res) => {
    let newFile_url=""
    
    db.Posts.findOne ( { where:  { id: req.params.postId}} )
        .then( (post) => {
            // console.log({post});        //OK

            //Verifier si c'est bien le user avant de faire update
            if (post.userId != req.params.id) {
                res.status(400).json("Echec! Vous n'êtes pas auteur du pubication.")
            }
            else {
                // si update avec photos,
                if (req.files!= "") {          
                    let filenames = post.img_url.split(' ');       // chercher nom du anciens photos
                    // console.log({filenames});           //OK
                    for ( let i=0; i< filenames.length; i++) {
                        fs.unlink(`images/${filenames[i]}`, () => {
                            console.log("images supprimé")});         // les supprimer
                        
                    }
                    // puis récupérer nouveaux files
                    for (let i=0; i<req.files.length; i++) {        
                        newFile_url += (req.files[i].filename)+ " ";
                            // console.log({newFile_url}); //OK
                            // valider les informations entrée dans nouveau post
                        let regex = /[@&"()_$*€£`+=\/;#]+$/;
                
                        if (validator.matches(req.body.title, regex)) {
                            res.status(400).json("Veuillez ne pas utiliser les characters spéciaux")
                            }
                            //après validation, update post
                        else {
                            db.Posts.update({
                                img_url: newFile_url,
                                title: xss(req.body.title),
                                content: xss(req.body.content),
                                },
                                {where: {id: req.params.postId}})
                                .then( () => res.status(200).json("Update publication réussi"))
                                .catch( err => res.status(500).json({
                                    message: "Erreur en update publication",
                                    err: err
                                }))
                        }
                                            
                    }
                }
                // si update sans photo
                else {
                    // valider les informations entrée dans nouveau post
                    let regex = /[@&"()_$*€£`+=\/;#]+$/;
                    if (validator.matches(req.body.title, regex)) {
                        res.status(400).json("Veuillez ne pas utiliser les characters spéciaux")
                    }
                    // puis update post
                    else {
                        db.Posts.update({
                            ...post,
                            title: xss(req.body.title),
                            content: xss(req.body.content),
                        },
                        {where: {id: req.params.postId}})
                            .then( () => res.status(200).json("Update publication réussi"))
                            .catch( err => res.status(500).json({
                                message: "Erreur en update publication",
                                err: err
                            }))
                    }
                }

            }
        })
        .catch ( err => {
            // console.log(err);
            res.status(500).json({
                message:"Problème chercher publication par server",
                err: err
            })
        })
}

// route pour récupérer post d'un user
exports.getUserPosts = (req, res) => {
    // console.log(req.params.id);         //OK
    models.posts
      .findAll({
        where: {userId: req.params.id},
        include: [ models.likes, models.commentaires],
        order: [["id", "DESC"]],
      })
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((error) => res.status(500).json(error));
}


// route pour supprimer post
exports.deletePost = (req, res) => {
    db.Posts
      .findOne({ where: { id: req.params.postId } })
      .then((post) => {     // chercher les images, video et effacer
            if (post.img_url !="") {
                let filenames = post.img_url.split(' ');
                console.log(filenames);
                for ( let i=0; i< filenames.length; i++) {
                    fs.unlink(`images/${filenames[i]}`, () => {console.log("images supprimé");});
                }
            }
      })
        .then(() => {
            db.likes.destroy({ where: { postId: req.params.postId } });
        })
        .then(() => {
            db.commentaires.destroy({ where: { postId: req.params.postId } });
        })
        .then(() => {
            db.Posts
            .destroy({ where: { id: req.params.postId } })
            .then(() =>
                res.status(200).json({ message: "Publications supprimée !" })
            )
            .catch((error) => res.status(400).json({ error }));
        })
      .catch((error) => res.status(500).json({ error }));
  };


//====> Ajout ou suppresson de like <====\\
exports.createLike = (req, res) => {
    db.likes.findOne ( {where: {
        postId: req.params.postId,
        userId : req.params.userId
    }} )
        .then ( likes => {
            if (likes) {
                db.likes.destroy ( { where: {
                    postId: req.params.postId,
                    userId : req.params.userId
                }} )
                    .then ( () => res.status(200).json('Enlever likes du post'))
                    .catch ( err => {
                        console.log(err);
                        res.status(500).json( 'Problème pour enlever likes du post')
                    })
            }
            else {
                db.likes.create ({
                    postId: req.params.postId,
                    userId: req.params.userId,
                })
                    .then( () => res.status(201).json('Ajouter like au post'))
                    .catch ( err => {
                        console.log(err);
                        res.status(500).json('Problème pour ajouter like')
                    })
            }
        })
        .catch ( err => {
            console.log(err);
            res.status(500).json("problème récupérer likes")
        })
}

// récupérer les likes
exports.getLike = (req, res) => {
    models.likes
      .findAll({ where: { postId: req.params.postId } })
      .then((like) => {
        res.status(200).json(like);
      })
      .catch((error) => res.status(500).json(error));
  };