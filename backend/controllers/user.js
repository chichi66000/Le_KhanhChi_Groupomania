const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {body, validationResult, check} = require('express-validator');

const sequelize = require('sequelize');
const db = require('../models');

// créer une route pour enregistrer nouvel utilisateur
exports.signup = (
    body ('email', 'Email is not valid') // valider email et password avant créer nouvel user
        .isEmail()
        .bail()
        .normalizeEmail(),
    body('password')        //valider password
        .isLength({min: 8}, {max:20})                 // min 8, max 20 characters
        .isUppercase({min:1})                   // min 1 majuscule
        .isLowercase({min:1})                   // min 1 minuscule
        .isNumeric({min:1})                     //min 1 chiffre
        .withMessage("Password doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et comprendre entre 8 et 20 charactères"),                    
    body('nom', 'nom invalid')
        .isString(),
    body('prenom', 'prenom invalid')
        .isString(),
    body('pseudo', 'pseudo déjà choisi')
        .isString(),
    body('fonction')
        .isString(),

    (req, res, next) => {
        const errors = validationResult(req); //si error, afficher error

        if(!errors.isEmpty()) { 
        return res.status(400).json({errors: errors.array()})
            }   
        // s'il n'y a pas d'erreur pour la vérification email, password, on va chercher dans BDD pour voir si email ou pseudo est déjà utilisé ou pas?

        else {  
            db.Users.findAll({      // chercher email, pseudo dans BDD user
                attributes: ['email', 'pseudo']
            }) 
                .then((email, pseudo) => {
                    if(email===req.body.email) { // si email trouvé dans BDD
                        return res.status(400).json({message : "Email déjà utilisé"})
                    }
                    else if(pseudo === req.body.pseudo) { // si pseudo déjà dans BDD
                        return res.status(400).json({message: "pseudo déjà utilisé"})
                    }
                    else{
                    // si user n'est pas dans BDD, hash passsword..  
                    bcrypt.hash(req.body.password, 10) // fonction asynchrone qui renvoie une promise avec hash comme response
                        .then( (hash) => {
                            // let userObject = req.body.Users
                            req.file? { // condition pour upload file avatar
                            ...req.body.user,
                            avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // ajouter image pour avater
                            } : {
                            ...req.body.user,
                            avatar: "http://localhost:3000/images/avatar_default.png"   // utiliser avatar default
                            };

                            const newUser = db.Users.create({ // crer user dans BDD
                                email: req.body.email,
                                password: hash ,
                                nom: req.body.nom,
                                prenom: req.body.prenom,
                                pseudo: req.body.pseudo,
                                fonction: req.body.fonction,
                                avatar: req.body.avatar,
                                isAdmin: 0,
                                
                            });
                            console.log("Utilisateur crée");
                            console.log(newUser);
                        })
                        .catch((error) => res.status(400).json({error}))
                    }                         
                })
                .catch((error) => res.status(500).json({error}))
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
                        id: user.id,
                        token: jwt.sign(
                            {id: user.id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        ),// un token permet la connexion
                        
                    });
                    console.log("Utilisateur login réussi")
                    }
                })
                .catch((error) => res.status(500).json({error}))
        })
        .catch((error) => res.status(500).json({error})) // erreur de serveur pour la requete
}

//route pour supprimer un user
exports.deleteUser = (req, res, next) => {
    db.Users.findOne({id: req.params.id})
        .then((user) => {
            const filename = user.avater.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                db.Users.deleteOne({email: req.body.email})
                    .then(() => res.status(200).json({message: 'User deleted'}))
                    .catch((error) => res.status(404).json({error}))
            })
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