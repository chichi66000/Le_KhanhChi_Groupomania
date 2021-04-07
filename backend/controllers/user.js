const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
// const {body, validationResult} = require('express-validator')
const validator = require('validator')
const passwordValidator = require("password-validator");

const sequelize = require('sequelize');
const db = require('../models');
const Op = require( 'sequelize');

let error ="";
// function pour récupérer error
exports.multerPrevent =( async (req, res, next) => {
    try { await res.status
    // console.log(res.status)
    
        if (error.length > 0) { console.log(error) ;res.status(400).json({ message: "rien va plus"})}
        else {error = ""; next()}
    // else { console.log ( "hiiii"); next() }
    }
    catch { err => console.log( "err"+ err)}
} )

const schema = new passwordValidator();
schema
    .is().min(8)                                    // Longueur minimum 8
    .is().max(20)                                   // Longueur maximum 100
    .has().uppercase()                              // Doit contenir une majuscule
    .has().lowercase()                              // Doit contenir une minuscule
    .has().digits(1)                                // Doit contenir au moins 1 chiffres
    .has().not().spaces()                           // Doit contenir aucun espace
    .is().not().oneOf(["Passw0rd", "Password123"])  // Mot de passes blacklistés
    .has(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)  // regex pour password fort

// créer une route pour enregistrer nouvel utilisateur

// exports.signup = 
exports.signup = ((req, res) => {
    const userData = req.body;
    console.log(userData)       // OK

        // Valider les données du email, nom, prénom, fonction avec validator
    if( !validator.isEmail(userData.email)) { res.status(400).json({message: " Email invalid"})}
    if(!validator.isAlpha(userData.nom, ["fr-FR"])) { res.status(400).json({message: " Nom invalid"})}
    if ( !validator.isAlpha(userData.prenom, ["fr-FR"])) { res.status(400).json({message: " Prenom invalid"})}
    if (userData.fonction.length > 0) {if ( !validator.isAlpha(userData.fonction, ["fr-FR"]))  { res.status(400).json({message: " veuillez entrer un format valid"})} }   
    
        // valider password avec password-validator
    if(!schema.validate(userData.password)) { res.status(400).json({message: " Password doit avoir 8 et 20 characters, 1 majuscule, 1 minuscule, 1 symbol"})}
       
        // après valider les donnée, chercher si email est déjà utilisé ; si non crée user
    else { db.Users.findOne ( {  where: { email: userData.email }})
        .then( user => { 
                    // error = "Problème pour crée utilisateur"
            if( user) {
                    res.status(400).json({message: " email déjà utilisé"}); 
                    error=" Pb avec email"; }
            else {
                 
                db.Users.findOne ( { where: { pseudo : userData.pseudo}})
                .then( user => { 
                    if (user) {
                        res.status(400).json({ message: " pseudo deja utilisé"});
                        error=" Pb avec pseudo";  
                    }
                    else {
                        error =""; 
                        bcrypt.hash(userData.password,10)   // hash password, puis créer user
                .then( hash => {
                // s'il n'y a pas photo, prendre nom de l'image avatar default, si non prendre le nom de requete file
                    let avatarName = "";
                    if ( req.file) { avatarName = req.file.filename}
                    else { avatarName = "avatar_default.png"} 
                        // créer user
                    const newUser = db.Users.create({
                        email: userData.email,
                        nom: userData.nom,
                        prenom: userData.prenom,
                        password: hash,
                        fonction: userData.fonction,
                        pseudo: userData.pseudo,
                        isAdmin: 0, 
                        avatar: avatarName
                    });
                    console.log("newuser" + newUser);
                    res.status(201).json( { message: "Utilisateur crée avec succès"})
                })
                .catch( () => { 
                    res.status(400).json( {messsage: " Problème pour crée utilisateur" });
                    
            } )
                    }
                })  
            }
        })
        .catch( () => res.status(500).json( { message: "Pb de server, impossible chercher email user"}))       
    }
})

//une route pour login
exports.login = (req, res, next) => {
    db.Users.findOne( {
        // attributes: ['email'],
        where: {email: req.body.email}})// trouver utilisateur avec email unique
        .then( (user) => {
            if(!user) { // si user n'existe pas dans bdd
                console.log('Utilisateur non trouvé');
                return res.status(401).json({error: 'Utilisateur non trouvé'}) // renvoyer message erreur
            }
            bcrypt.compare(req.body.password, user.password) // si user est trouvé, comparer le mot de passe entrée avec celui dans bdd
                .then((valid) => {
                    if(!valid) {// si mdp n'est pas valid, renvoyer error
                        console.log('Mot de passe incorrect')
                        return res.status(401).json({ error: 'Mot de passe incorrect'})
                    }
                    else {
                    res.status(200).json({ // si mdp correct, renvoyer id
                        
                        currentUser: {
                            nom: user.nom,
                            email: user.email, 
                            pseudo: user.pseudo,
                            userId: user.id},
                        
                        token: jwt.sign(            // un token permet la connexion
                            {userId: user.id },
                            "RANDOM_TOKEN_SECRET", 
                            {expiresIn: "24h",})
                            });
                            console.log("Utilisateur login réussi")
                            next()
                    };
                })
                .catch((error) => res.status(500).json({error}))
        })
        .catch((error) => res.status(500).json({error})) // erreur de serveur pour la requete
}

//route pour supprimer un user
exports.deleteUser = (req, res, next) => {
    db.Users.findOne({where: {id: req.params.id}})
        .then((user) => {
            const filename = user.avater.split('/images/')[1];
            if (!filename.includes("avatar_default.png")) {
                fs.unlink(`images/${filename}`, () => {
                    db.Users.destroy ({where: {id:req.params.id}})
                        .then(() => res.status(200).json({message: "utilisateur supprimé"}))
                        .catch((error) => res.status(400).json({error}))
                })
            }
            else {
                db.Users.destroy({where: {id: req.params.id}})
                    .then(() => res.status(200).json({message: "Utilisateur supprimé"}))
                    .catch((error) => res.status(400).json({error}))
            }
        })
        .catch((error) => res.status(500).json({error}))
}

// route pour update user
exports.updateUser = (req, res, next) => {
    let userObject = {};
    req.file?       // condition si update avec photo ou non
        (db.Users.findOne({id:req.params.id}) 
        //avec photo => chercher user, split image, et changer nouvel avatar
            .then( (user) => {                
            const filename = user.avater.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
        })
            .catch((error) => res.status(500).json({error}))
            (userObject = { 
                ... JSON.parse(req.body.user),
                avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  
            } ))

    : (userObject = {...req.body.user})       // update sans photo => update les infos données

    db.Users.updateOne (
        {id: req.params.id},
        {...userObject, id: req.params.id, updatedAt: new Date()}
    )
        .then(() => res.status(200).json({message: 'User modified ! '}))
        .catch((error) => res.status(404).json({error}))
    
}

// route pour récupérer utilisateur (pour page profil)
exports.getOneUser = (req, res, next) => {
    let num = 18;
    console.log(num);
    db.Users.findOne( {where: { id: req.params.id}})
        .then((user) => {
            
            if(! user) {res.status(404).json({message: "Utilisateur non trouvé"}
                )}
            else {
                console.log("usernom" + user.nom)   //OK
                let currentUser = {
                    userNom: user.nom,
                    userId: user.id,
                    userPseudo: user.pseudo,
                    email: user.email
                }
                // console.log(currentUser)    //OK
                res.status(200).json({currentUser});
            }
        })
        .catch(() => res.status(500).json({message: "promblème connexion avec base de donnée"}))
}

// route pour récupéer tous les utilisateurs (pour admin par expemple)
exports.getAllUser = (req, res, next) => {
    db.Users.findAll()
        .then((users) => {
            if (! users) { res.status(404).json({ message:"Utilisateur non trouvé" })}
            res.status(200).json(users)})
        .catch((error) => res.status(404).json({error}))
}