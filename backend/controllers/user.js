// les npm nécessaires
const crypto = require ('crypto')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// sequelize pour base de donnée
const sequelize = require('sequelize');
const db = require('../models');
const Op = require( 'sequelize');
const { Sequelize } = require('sequelize');

// middlewaire poue envoyer email pour reset/update password
const sendEmail = require('./email');

// schema pour valider password
const validator = require('validator')
const passwordValidator = require("password-validator");
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
                // si trouvé user dans BDD avec email => email déjà utilisé
            if( user) {
                res.status(400).json({message: " email déjà utilisé"}); 
            }
            else {  // email n'est pas dans BDD
                // vérifier si pseudo est déjà présente dans BDD 
                db.Users.findOne ( { where: { pseudo : userData.pseudo}})
                .then( user => { 
                    if (user) {     // pseudo trouvé dans BDD
                        res.status(400).json({ message: " pseudo deja utilisé"});
                         
                    }
                    else {          // pas de pseudo
                        
                        bcrypt.hash(userData.password,10)   // hash password, puis créer user
                            .then( hash => {
                            // s'il n'y a pas photo, prendre nom de l'image avatar default,
                            //  si non prendre le nom de requete file
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
exports.login = (req, res) => {
    db.Users.findOne( {
        // chercher user avec son email
        where: {email: req.body.email}})// trouver utilisateur avec email unique
        .then( (user) => {
            if(!user) { // si user n'existe pas dans bdd
                console.log('Utilisateur non trouvé');
                return res.status(401).json({error: 'Utilisateur non trouvé'}) // renvoyer message erreur
            }
            // si user est trouvé, comparer le mot de passe entrée avec celui dans bdd
            bcrypt.compare(req.body.password, user.password) 
                .then((valid) => {
                    if(!valid) {// si mdp n'est pas valid, renvoyer error
                        console.log('Mot de passe incorrect')
                        return res.status(401).json({ error: 'Mot de passe incorrect'})
                    }
                    // si mdp correct, renvoyer user, et token
                    else {
                    res.status(200).json({ 
                        currentUser: {
                            userNom: user.nom,
                            email: user.email, 
                            userPseudo: user.pseudo,
                            userId: user.id,
                            avatar: user.avatar,
                            isAdmin: user.isAdmin
                        },
                        token: jwt.sign(            // un token permet la connexion
                            {userId: user.id },
                            process.env.SECRET_TOKEN, 
                            {expiresIn: "24h",})
                    });
                    console.log("Utilisateur login réussi")
                            
                    };
                })
                .catch((error) => res.status(500).json({error}))
        })
        .catch((error) => res.status(500).json({error})) // erreur de serveur pour la requete
}

// ====> route pour supprimer un user <===
exports.deleteUser = (req, res) => {
    // chercher user avec son id
    db.Users.findOne({where: {id: req.params.id}})
        .then( user => {
            console.log("user" + user);      //OK
            console.log(req.body.password);
            if(!user) { // si user n'existe pas dans bdd
                console.log('Utilisateur non trouvé');
                return res.status(401).json({error: 'Utilisateur non trouvé'}) // renvoyer message erreur
            }
            // si trouvé user, comparer password du requête avec celui dans BDD
            bcrypt.compare(req.body.password, user.password)
                .then( valid => {
                    if (!valid) {           // si c'est pas le même password
                        console.log('Mot de passe incorrect')
                        return res.status(401).json({ error: 'Mot de passe incorrect'})
                    }
                    
                    // Si password est le même
                    else {
                        const filename = user.avatar
                        //si user a son avatar => effacer dans le mémoire                  
                        if( !filename.includes("avatar_default.png")) {
                            console.log(filename);
                            fs.unlink(`images/${filename}`, () => {
                                //puis supprimer le user
                                db.Users.destroy ({where: {id:req.params.id}})
                                    .then(() => res.status(200).json({message: "utilisateur supprimé"}))
                                    .catch((error) => res.status(400).json({error}))
                            })
                        }
                        else {
                            // si user n'a pas son avatar => supprimer directement user
                            db.Users.destroy ({where: {id:req.params.id}})
                                .then(() => res.status(200).json({message: "utilisateur supprimé"}))
                                .catch((error) => {
                                        console.log(error)
                                        res.status(400).json({message: "Problème pour supprimer user"})
                                }) 
                        }
                    }
                })
        })
                .catch( error => { 
                    console.log(error);
                    res.status(500).json( { message: "Problème comparer le password"})
                })
            
        .catch(error => { 
            console.log(error); 
            res.status(500).json( { message: "Problème pour trouver user, réessayer plus tard"})
        })
}

// ===> route pour supprimer 1 user par Admin <===
exports.adminDelete = (req, res) => {
    // chercher user avec son id
    db.Users.findOne ( { where: { id: req.params.id}})
        .then( user => {
            // si user a son photo avatar, supprimer la photo avant supprimer le compte
            const filename = user.avatar
            if( !filename.includes("avatar_default.png")) {
                console.log(filename);
                fs.unlink(`images/${filename}`, () => {
                    db.Users.destroy ({where: {id:req.params.id}})
                        .then(() => res.status(200).json({message: "utilisateur supprimé"}))
                        .catch((error) => res.status(400).json({error}))
                })
            }
            // si c'est un avatar default; supprimer le compte user
            else { 
                db.Users.destroy ({where: {id:req.params.id}})
                    .then(() => res.status(200).json({message: "utilisateur supprimé"}))
                    .catch((error) => {
                    console.log(error)
                    res.status(400).json({message: "Problème pour supprimer user"})
                                      }) 
            }
                          
        })
        .catch ( err => { console.log(err); res.status(500).json("User non trouvé")})
}


// ===> route pour donner le role admin pour 1 user <===
exports.adminChange = (req, res) => {
    // vérifier si c'est bien un admin qui effectuer ce changement
    db.Users.findOne ({where : { id: req.params.id} })
        .then( user => {
            // si ce n'est pas un admin, envoyer error
            if (user.isAdmin == false) {
                res.status(400).json("Vous n'êtes pas admin, vous ne pouvez pas modifier les utilisateurs")
            }
            // si c'est bien admin, en chercher utilisateur pour attribuer son rôle
            else {
                db.Users.findOne ( {where : { id: req.params.userId} } )
                    .then( user => {
                        console.log(user.isAdmin);      // OK
                        // update le rôle admin pour ce user
                        db.Users.update( {
                            ...user,
                            isAdmin: true,
                            id: req.params.userId
                        },
                        {where : { id: req.params.userId}} )
                            .then( () => res.status(200).json("changer status admin du user"))
                            .catch( err => {
                                console.log(err);
                                res.status(500).json("Problème pour changer status admin du user")
                            })
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json("User non trouvé")
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json("problème de trouver cet admin")
        })
    
}


// ==> route pour update user password <===

exports.updatePassword = (req, res) => {
    let newPass = req.body.newPass;
    let oldPass = req.body.oldPass;
    console.log( {newPass});
    console.log( {oldPass});

    // 1) Get user from database by Id
    db.Users.findOne ( { where: { id: req.params.id}})
        .then( user => {
    // 2) Check if the POSTED password is correct
            bcrypt.compare(oldPass, user.password)
                .then( valid => {
                    // si password pas correct => erreur
                    if (! valid) {
                        res.status(400).json( { message: "Password incorrect"})
                    }
                    // 3) If password correct, update user with new hash password
                    else {
                        bcrypt.hash(newPass, 10)
                        .then( hash => {
                            db.Users.update( {
                                ...req.body,
                                password: hash,
                                id: req.params.id
                            },
                            {where: { id: req.params.id}} )
                        // 4) Send JWT, login user
                            const token = jwt.sign(            
                                {userId: user.id },
                                process.env.SECRET_TOKEN, 
                                {expiresIn: "24h",});
                                    
                            res.status(200).json( {
                                    message: "Password reset avec succès",
                                    token,
                            })
                        })
                        .catch( err => {
                        console.log(err);
                        res.status(500).json( {message: "Problème pour update password"})
                    })
                    }
                })
                .catch( err => {
                    console.log(err);
                    res.status(500).json( { message: "Problème pour comparer les passwords"})
                }) 
                        
        })
        .catch( err => { 
            console.log(err);
            res.status(500).json( { message: "Problème server, pas trouvé user"})
        })
}

// ===> route pour update profile user <===
exports.updateUser = (req, res) => {
    // console.log(req.body);  // Ok
    let avatarName = "";
    let newPseudo = "";
    let newEmail = "";
    let newFonction = "";

    // Chercher user avec son ID
    db.Users.findOne ({ where: {id: req.params.id}} )
        .then( user => {
            // si update avec photo avatar
            if (req.file) {
                const file = user.avatar;
                // si avatar du user est "avatar_default"; on fait rien
                if( file.includes("avatar_default.png")) {
                    console.log("file avatar rien à effacer");
                }
                // si non, on supprimer avatar dans le fichier images
                else {
                    fs.unlink(`images/${file}`, function (err) {
                        if (err) { throw err; }
                        // if no error, file has been deleted successfully
                        else { 
                            console.log('File deleted!');
                        }
                    })
                }
                // Puis update avatar dans BDD
                db.Users.update( {
                    ...user,
                    avatar: req.file.filename},
                    {where: {id:req.params.id}})
                    .then( () => { console.log("Update avatar réussi")})
                    .catch(err => {
                        console.log(err);
                        res.status(500).json( {message: "Problème pour update avatar"})
                    })
            }
            
            //si update avec email: vérifier si email est déjà utilisé dans BDD?
            if (req.body.email.length >0 && req.body.email !="undefined") {
                console.log("Il y a email dans update");
                db.Users.findOne({where: {email:req.body.email}})
                    .then( user => {
                        // si email est déjà utilisé, envoyer 400
                        if (user) { res.status(400).json({message: "Email déjà utilisé"})}

                        // si email n'est pas encore dans BDD, update user avec nouvel email
                        newEmail = req.body.email; console.log("Email updatesera" + newEmail);
                        db.Users.update({...user, email:newEmail}, {where: {id:req.params.id}})
                            .then( () => { console.log("Update email réussi")})
                            .catch(err => {
                                console.log(err);
                                res.status(500).json( {message: "Problème pour update email"})
                            })
                    })
                    .catch( err => { console.log(err); res.status(500).json("Problème chercher email");})
            }

            //si update avec pseudo: vérifier si pseudo est déjà présenté dans BDD?
            if (req.body.pseudo.length >0 && req.body.pseudo !="undefined") {
               
                db.Users.findOne({where: {pseudo:req.body.pseudo}})
                    .then( user => {
                        // si pseudo est déjà utilisé, envoyer 400
                        if (user) { res.status(400).json({message: "Pseudo déjà utilisé"})}

                        // si pseudo n'est pas encore dans BDD, update user avec pseudo
                        newPseudo = req.body.pseudo; console.log("Pseudo update sera " + newPseudo);
                        db.Users.update( {...user, pseudo: newPseudo}, {where: {id:req.params.id}})
                            .then( () => {console.log("Update pseudo réussi")})
                            .catch(err => {
                                console.log(err);
                                res.status(500).json( {message: "Problème pour update pseudo"})
                            })
                    })
                    .catch( err => { console.log(err); res.status(500).json("Problème pour chercher pseudo")})
            }

            // si update avec fonction:
            if(req.body.fonction.length >0 && req.body.fonction !="undefined") {
                newFonction = req.body.fonction;
                console.log({newFonction});
                // update user fonction
                db.Users.update({...user,fonction: newFonction},{ where: {id: req.params.id}} )
                    .then( () => {
                        console.log("Update fonction réussi");
                    } )
                    .catch( err => {console.log(err); res.status(500).json("Problème update fonction")} )
            }

            // envoyer status 200 si tout va bien
            res.status(200).json( {
                message: "Update profil réussi",
                
            })
            
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({message: "Pb server, user non trouvé"})
        })
}

// ===> route pour récupérer 1 utilisateur (pour page profil) <===
exports.getOneUser = (req, res) => {
    
    db.Users.findOne( {where: { id: req.params.id}})
        .then((user) => {
            //user non trouvé => erreur
            if(! user) {res.status(404).json({message: "Utilisateur non trouvé"}
            )}
            // user trouvé => envoyer la response avec user
            else {
                console.log("usernom" + user.nom)   //OK
                let currentUser = {
                    userNom: user.nom,
                    userId: user.id,
                    userPseudo: user.pseudo,
                    email: user.email,
                    avatar: user.avatar,
                    isAdmin: user.isAdmin
                }
                console.log(currentUser.avatar)    //OK
                res.status(200).json({currentUser});
            }
        })
        .catch(() => res.status(500).json({message: "problème connexion avec base de donnée"}))
}

// ===> route pour récupéer tous les utilisateurs (pour admin par expemple) <===
exports.getAllUser = (req, res) => {
    // vérifier si user connecté est admin ou pas?
    db.Users.findOne ( { where: { id: req.params.id }})
        .then( user => {
            // s'il n'est pas admin; interdit les actions
            if(user.isAdmin === false) { res.status(400).json("Vous n'êtes pas admin")}
            else {
            // si user est admin, chercher tous les user, trier par id 
                db.Users.findAll( {
                    attributes: ["id", "email", "nom", "prenom", "createdAt", "pseudo", "isAdmin"]
                },
                {order: ["id"] })
                    .then((users) => {
                        if (! users) { res.status(404).json({ message:"Utilisateur non trouvé" })}
                        // renvoyer liste des users
                        res.status(200).json( {users})
                    })
                    .catch((error) => res.status(404).json({error}))
            }
        })
        .catch( err => {
            console.log(err);
            res.status(400).json("Pas trouvé user, actions interdites")
        })
}

// ===> route pour forgot password <===
exports.forgotPassword = async (req, res) => {
    // 1) Get user based on email
    const user = await db.Users.findOne ( { where: {email: req.body.email } })
    try {
        // user pas trouvé
        if ( ! user ) { res.status(404).json({ message: " Utilisateur non trouvé avec email "})}

        // 2) User trouvé => Generate random reset token
        else { 
             //token expires after one hour 
                let userObject= user
                const resetToken = jwt.sign(            //créer un token 
                    {userId: user.id },
                    process.env.SECRET_TOKEN, 
                    {expiresIn: "1h",});
                // hash ce token pour plus de sécurité     
                const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
                console.log({resetToken}, { resetTokenHash});      //OK
            
                // update BDD avec ce resetTokenHash
            db.Users.update (
                {...userObject,
                    email: req.body.email,
                    createPasswordResetToken: resetTokenHash
                },
                {where: { email: req.body.email} }
                )
                .then( () => res.status(200).json( { message: " Reset Token réussi"}))
                .catch( error => {
                    res.status(404).json({message: "Problème pour update token user"});
                    console.log(error);
                } )
                
            // 3) Send token to user email
            const resetURL = `${req.protocol}://${process.env.GROUPO_HOST}/reset/${resetToken}`;
                // avec ce message, format HTML
            const message = `<p>Password oublié? Cliquez sur ce link pour changer votre password (valabe pour 2 heurs) </p> <br> <a href="${resetURL}">${resetURL}</a>  <br> Si ce n'est pas le cas, ignorez ce message</p>`  ;

            // envoyer email à user 
            await sendEmail( {
                email: req.body.email,
                subject: "Groupomania, reset password ( valide pour 2 heures )",
                message
            })
                .then( () => res.status(200).json( { message: "Verifier votre email pour reset password"}))
                .catch ( err => {
                    console.log(err)
                    res.status(500).json({ message: "Problème pour envoyer email"})
                // en cas de pb d'envoie, réinitialiser le colonne resetPassword à undefined
                    db.Users.update (
                        {...userObject,
                            email: req.body.email,
                            createPasswordResetToken: 'undefined'
                        },
                        {where: { email: req.body.email} }
                        )
                        .then( () => res.status(200).json( { message: " ResetToken effacé"}))
                        .catch( (e) =>{console.log(e);res.status(404).json({message: "Problème pour effacé resetToken user"})}) 
                })
        }
    } catch (err) { console.log(err) }
}

// ===> route pour reset password <===
exports.resetPassword = async (req, res) => {
    // 1) Récupérer user selon token
    try {
        const resetToken = req.params.token;
        // vérifier si token n'est pas expiré
        jwt.verify(resetToken, 'RANDOM_TOKEN_SECRET', function (err) {
            if (err) { 
                console.log(err);
                res.status(400).json({message: "token expired"})
            }
            else {
                // 2) Si token est encore valide, comparer avec celui dans BDD
                const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
                // chercher user avec la colonne qui a ce token
                const user= db.Users.findOne( { where: {
                    createPasswordResetToken: hashToken,
                    }
                })
                    if ( !user ) {          // si pas user
                            res.status(400).json({ message: "Token invalid, user non trouvé"})
                        }
                    else {                  
                        // 3) Si user est présent, Update nouveau password
                        bcrypt.hash(req.body.password, 10)
                            .then( hash => {
                                db.Users.update( {
                                    ...user,
                                    password: hash,
                                    createPasswordResetToken: "undefined",
                                    }, 
                                    { where: {createPasswordResetToken: hashToken}} )
                                    
                                //4) Envoyer nouveau token pour login
                                const token = jwt.sign(            
                                    {userId: user.id },
                                    process.env.SECRET_TOKEN, 
                                    {expiresIn: "24h",});
                                        
                                res.status(200).json( {
                                        message: "Password reset avec succès",
                                        token,
                                    })
                                })
                            .catch(() => res.status(400).json( {message: 'Problème server pour chercher user'}))
                        }
            }
        })
    } 
    catch (e) { console.log(e) }
}
