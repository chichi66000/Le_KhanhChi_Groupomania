const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models');

const {body, validationResult, check} = require('express-validator');

var passwordValidator = require('password-validator');
// Create a schema
var schema = new passwordValidator();
 
// Add properties to schema password
schema
.is().min(8)                            // Minimum length 8
.is().max(100)                          // Maximum length 100
.has().uppercase()                      // Must have uppercase letters
.has().lowercase()                      // Must have lowercase letters
.has().digits(1)                        // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// créer une route pour enregistrer nouvel utilisateur
exports.signup = (
    body ('email', 'Email is not valid') // valider email et password avant créer nouvel user
        .isEmail()
        .bail()
        .normalizeEmail(),
    body('password', 'Password invalid'),
    body('nom', 'nom invalid')
        .isString(),
    body('prenomnom', 'prenom invalid')
        .isString(),
    body('pseudo', 'pseudo déjà choisi')
        .isString()
,
    (req, res, next) => {
        const userObject = JSON.parse(req.body.user);
        const errors = validationResult(req); //si error, afficher error
        const nom =  userObject.nom;
        const prenom= userObject.prenom;
        const email= userObject.email;
        const password = userObject.password;
        const fonction = userObject.fonction;
        const pseudo = userObject.pseudo;
        const avatar = userObject.avatar;
        const isAdmin = "";

        if(!errors.isEmpty()) { 
        return res.status(400).json({errors: errors.array()})
            }     
        else {
           
            models.Users.findOne({
                attributes: ['email', 'pseudo'],
                where: {email : email, pseudo: pseudo}
            }) // si pas error, chercher les users
                .then((userFound) => {
                    if(userFound) {
                        return res.status(400).json({message : "Email déjà utilisé"})
                    }
                    else {
                        
                        bcrypt.hash(userObject.password, 10) // fonction asynchrone qui renvoie une promise avec hash comme response
                        .then( hash => {
                            req.file? { // condition pour upload file avatar
                            ...userObject,
                            avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // ajouter image pour avater
                            } : {
                            ...userObject,
                            avatar: "http://localhost:3000/images/avater_default.png"   // utiliser avatar default
                            };

                            userObject.id===1? userObject.isAdmin= true : userObject.isAdmin=false; // 1er user est admin

                            const newUser = models.Users.create({ // crer user dans BDD
                                email: email,
                                password: hash ,
                                nom: nom,
                                prenom: prenom,
                                pseudo: pseudo,
                                fonction: fonction,
                                avatar: avatar,
                                isAdmin: isAdmin,
                                createdAt: new Date(),
                                updatedAt: ''
                            });
                            newUser.save() // enregistrer user
                                .then(() => res.status(201).json({message: "utilisateur crée"}))
                                .catch((error) => res.status(400).json({error}))
                        })
                        .catch((error) => res.status(400).json({error}))
                        
                    }
                })
                .catch((error) => res.status(500).json({error}))
        
        }
})

