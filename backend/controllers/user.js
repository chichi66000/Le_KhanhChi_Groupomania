const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../models');

const {body, validationResult, check} = require('express-validator');

// valider avec validator-password
// var passwordValidator = require('password-validator');
// Create a schema
// var schema = new passwordValidator();
 
// // Add properties to schema password
// schema
// .is().min(8)                            // Minimum length 8
// .is().max(100)                          // Maximum length 100
// .has().uppercase()                      // Must have uppercase letters
// .has().lowercase()                      // Must have lowercase letters
// .has().digits(1)                        // Must have at least 1 digits
// .has().not().spaces()                           // Should not have spaces
// .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// créer une route pour enregistrer nouvel utilisateur
exports.signup = (
    body ('email', 'Email is not valid') // valider email et password avant créer nouvel user
        .isEmail()
        .bail()
        .normalizeEmail(),
    body('password', 'Password invalid')    //valider password
        .isLength({min: 8})                 // min 8 characters
        .isUppercase({min:1})               // min 1 majuscule
        .isLowercase({min:1})               // min 1 minuscule
        .isNumeric({min:1}),                // min 1 chiffre
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
        const userObject = JSON.parse(req.body.Users);

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
           
            db.Users.findOne({
                attributes: ['email', 'pseudo'],
                where: {email : email, pseudo: pseudo}
            }) // si pas error, chercher les users
                .then((userFound) => {
                    if(userFound) {
                        return res.status(400).json({message : "Email déjà utilisé"})
                    }
                    
                        
                    bcrypt.hash(password, 10) // fonction asynchrone qui renvoie une promise avec hash comme response
                        .then( (hash) => {
                            req.file? { // condition pour upload file avatar
                            ...userObject,
                            avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // ajouter image pour avater
                            } : {
                            ...userObject,
                            avatar: "http://localhost:3000/images/avatar_default.png"   // utiliser avatar default
                            };

                            userObject.id===1? userObject.isAdmin= true : userObject.isAdmin=false; // 1er user est admin

                            const newUser = db.Users.create({ // crer user dans BDD
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
                                .catch((error) => {
                                   res.status(400).json({error}); console.log(error) 
                                } )
                        })
                        .catch((error) => {res.status(400).json({error}); console.log(error)} )
                        
                    
                })
                .catch((error) => res.status(500).json({error}))
        
        }
})

//une route pour login
exports.login = (req, res, next) => {
    db.Users.findOne( {
        attributes: ['email'],
        where: {email: req.body.email}})// trouver utilisateur avec email unique
        .then( (user) => {
            if(!user) { // si user n'existe pas dans bdd
                return res.status(401).json({error: 'Utilisateur non trouvé'}) // renvoyer message erreur
            }
            bcrypt.compare(req.body.password, user.password) // si user est trouvé, comparer le mot de passe entrée avec celui dans bdd
                .then((valid) => {
                    if(!valid) {// si mdp n'est pas valid, renvoyer error
                        return res.status(401).json({ error: 'Mot de passe incorrect'})
                    }
                    res.status(200).json({ // si mdp correct, renvoyer id
                        userId: user.id,
                        token: jwt.sign(
                            {userId: user.id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )// un token permet la connexion
                    })
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
    req.file? // condition si upadate avec photo ou non
        (db.Users.findOne({id:req.params.id}) // update avec photo avatar
            .then( (user) => {
            const filename = user.avater.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
            })
            .catch((error) => res.status(500).json({error})))
            (userObject = {
            ... JSON.parse(req.body.user),
            avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            })
    :   (userObject = {...req.body});  // update sans photo
    db.Users.updateOne (
        {id: req.params.id},
        {...userObject, id: req.params.id, updatedAt: new Date()}
    )
        .then(() => res.status(200).json({message: 'User modified ! '}))
        .catch((error) => res.status(404).json({error}))
    
}