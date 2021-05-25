// les npm nécessaires
const crypto = require ('crypto')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const db = require('../models')
const Sequelize = require('sequelize');
const association = require('../models/association').association
const sequelize = require('../models/index').sequelize;
const models = association(sequelize);

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
    .has(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&.]{8,}$/)  // regex pour password fort


// function pour crypter et decrypter email
// key et iv pour crypto
let key = crypto.createHash("sha256").update("OMGCAT!", "ascii").digest();
let iv = "1234567890123456"
let algorithm = 'aes-256-ctr'

//function pour encrypter
function encrypt(text){
var cipher = crypto.createCipheriv(algorithm, key, iv)
var crypted = cipher.update(text,'utf8','hex')
crypted += cipher.final('hex');
return crypted;
}

// function pour decrypter
function decrypt(text){
var decipher = crypto.createDecipheriv(algorithm, key, iv)
var dec = decipher.update(text,'hex','utf8')
dec += decipher.final('utf8');
return dec;
}
// créer une route pour enregistrer nouvel utilisateur

exports.signup = ((req, res) => {
    const userData = req.body;
    console.log(userData)       // OK

    // crypter email entrée
    let emailHash = encrypt(userData.email)
    console.log(emailHash + " email")

        // Valider les données du email, nom, prénom, fonction avec validator
    if( !validator.isEmail(userData.email)) {return res.status(400).json({message: " Email invalid"})}

    if(!validator.matches(userData.nom, /^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i)) {return res.status(400).json({message: " Nom ne peut être que les lettres"})}

    if (!validator.matches(userData.prenom, /^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i)) {return res.status(400).json({message: " Prenom ne peut être que les lettres"})}

    if (!validator.matches(userData.pseudo, /^[a-z0-9éèàùûêâôë][a-z0-9éèàùûêâôë '-]+$/i)) {return res.status(400).json({message: " Pseudo doit être en lettre ou chiffre"})}

    if (userData.fonction.length > 0 &&  (!validator.matches(userData.fonction, /^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i)) ) {return res.status(400).json({message: " veuillez entrer que les lettres"}) }   
    
        // valider password avec password-validator
    if(!schema.validate(userData.password)) {return res.status(400).json({message: " Mot de passe doit avoir 8 et 20 characters, 1 majuscule, 1 minuscule, 1 charactère spécial"})}
    
    // vérifier si password et passwordCheck soit le même
    if ( userData.password !== userData.passwordCheck) { return res.status(400).json({message: "Mot de passe doit être le même pour le 2 champs"})}

        // après valider les donnée, chercher si email est déjà utilisé ; si non crée user
    else { db.Users.findOne ( {  where: { email: emailHash }})
        .then( user => { 
                // si trouvé user dans BDD avec email => email déjà utilisé
            if( user) {
              return  res.status(400).json({message: " email déjà utilisé"}); 
            }
            else {  // email n'est pas dans BDD
                // vérifier si pseudo est déjà présente dans BDD 
                db.Users.findOne ( { where: { pseudo : userData.pseudo}})
                .then( user => { 
                    if (user) {     // pseudo trouvé dans BDD
                       return res.status(400).json({ message: " pseudo deja utilisé"});
                         
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
                                        email: emailHash,
                                        nom: userData.nom,
                                        prenom: userData.prenom,
                                        password: hash,
                                        fonction: userData.fonction,
                                        pseudo: userData.pseudo,
                                        isAdmin: 0, 
                                        avatar: avatarName
                                    });
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
    // crypter email entrée afin de comparer avec celui dans BDD
    let emailLogin = encrypt(req.body.email)
    db.Users.findOne( {
        // chercher user avec son email
        where: {email: emailLogin}})// trouver utilisateur avec email unique
        .then( (user) => {
            if(!user) { // si user n'existe pas dans bdd
                return res.status(401).json({error: 'Utilisateur non trouvé'}) // renvoyer message erreur
            }
            // si user est trouvé, comparer le mot de passe entrée avec celui dans bdd
            bcrypt.compare(req.body.password, user.password) 
                .then((valid) => {
                    if(!valid) {// si mdp n'est pas valid, renvoyer error
                        return res.status(401).json({ error: 'Mot de passe incorrect'})
                    }
                    // si mdp correct, renvoyer user, et token
                    else {

                        let refreshToken = jwt.sign(      // un refreshtoken pour cookie
                            {userId: user.id },
                            process.env.REFRESH_TOKEN, 
                            {expiresIn: "24h",})
                        
                        let token = jwt.sign(            // un token permet la connexion
                            {userId: user.id },
                            process.env.SECRET_TOKEN, 
                            {expiresIn: "1m",})

                        /* On créer le cookie contenant le refresh token */
                        res.cookie('refreshtoken', refreshToken,
                        {
                            httpOnly: true,
                            secure: false,
                            sameSite:false,
                            maxAge: "86400000"    // 24h en milisecond
                        })

                        res.status(200).json({ // si mdp correct, envoyer user, token                       
                            currentUser: {
                            userNom: user.nom,
                            email: req.body.email, 
                            userPseudo: user.pseudo,
                            userId: user.id,
                            avatar: user.avatar,
                            isAdmin: user.isAdmin
                            },
                            token,
                            refreshToken
                        });
                    };
                })
                .catch((error) => res.status(500).json({error}))
        })
        .catch((error) => res.status(500).json({error})) // erreur de serveur pour la requete
}


// route pour refresh un token expires
exports.refreshToken = (req, res) => {
    let refreshtoken = req.cookies.refreshtoken;
    
    if (!refreshtoken){
        return res.status(403).send("veuillez connecter")
    }
    else {
        //verify the refresh token
        
        try{
            jwt.verify(refreshtoken, process.env.REFRESH_TOKEN)
        }
        catch(e){
            console.log(e);
            return res.status(401).send("error avec ce token"); 
        }

        // creer un nouveau token et envoyer au frontend
        let newToken = jwt.sign(            
            {userId: req.params.id },
            process.env.SECRET_TOKEN, 
            {expiresIn: "2h",})
        // envoyer au client nouveau token
        res.status(201).json(newToken)
    
    }
};

// route pour logout
exports.logout = (req, res) => {
    res.clearCookie('refreshtoken')         //supprimer le cookie refreshtoken
    res.send('supprimer cookie')
                        
};

//route pour user supprimer son compte
exports.deleteUser = (req, res) => {

    db.Users.findOne({where: {id: req.params.id}})
        .then( user => {
            console.log("user" + user);      //OK
            console.log(req.body.password);
            if(!user) { // si user n'existe pas dans bdd
                return res.status(401).json({error: 'Utilisateur non trouvé'}) // renvoyer message erreur
            }
            // si trouvé user, comparer password du requête avec celui dans BDD
            bcrypt.compare(req.body.password, user.password)
                .then( valid => {
                    if (!valid) {           // si c'est pas le même password
                        return res.status(401).json({ error: 'Mot de passe incorrect'})
                    }
                    
                    // Si password est le même, chercher avatar et effacer
                    else {
                        const filename = user.avatar
                        //si user a son avatar => effacer dans le mémoire                  
                        if( !filename.includes("avatar_default.png")) {
                            console.log(filename);
                            fs.unlink(`images/${filename}`, () => {
                                console.log("Avatar supprimé")
                            })
                        }
                    }
                })
                .catch( error => { 
                    console.log(error);
                    res.status(500).json( { message: "Problème comparer le password"})
                })
        })

            //supprimer les likes de ce user
            db.likes.findAll({ where: { userId: req.params.id } })
                .then( likes => {
                    // si user n'a pas de like
                    if (!likes) { console.log("User n'a pas like")}
                    // si user a des likes, supprimer ses likes
                    else {
                        db.likes.destroy({ where: { userId: req.params.id } });
                    }
                })

            // supprimer les commentaires du user
            db.commentaires.findAll({ where: { userId: req.params.id } })
                .then(commentaires => {
                    // pas de commentaires
                    if (! commentaires) { console.log("Pas de commentaire de ce user")}
                    // commentaires trouvé
                    else {
                        db.commentaires.destroy({ where: { userId: req.params.id } });
                    }
                })
            
            // chercher les publications de ce user
            db.Posts.findAll({ where: { userId: req.params.id } })
                .then((posts) => {
                    //si user n'a pas de publication
                    if (!posts) {
                        console.log("user n'a pas de publication")
                    }
                    else {
                            // chercher les images, video et effacer dans mémoire
                        for ( let i=0; i<posts.length; i++) {
                            if (posts[i].img_url !="") {
                            let filenames = posts[i].img_url
                            fs.unlink(`images/${filenames}`, () => {console.log("images supprimé");});
                            }
                        }
                            //supprimer les publications
                        db.Posts.destroy({ where: { userId: req.params.id } })
                        
                    }     
                })

        // supprimer ce user
        .then( () => {
            db.Users.destroy ({where: {id:req.params.id}})
            .then( () => res.status(200).json("utilisateur supprimé"))
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
                    console.log("avatar supprimer")
                })
                
            }        
        })
        //supprimer les likes de ce user
            db.likes.findAll({ where: { userId: req.params.id } })
                .then( likes => {
                    // si user n'a pas de like
                    if (!likes) { console.log("User n'a pas like")}
                    // si user a des likes, supprimer ses likes
                    else {
                        db.likes.destroy({ where: { userId: req.params.id } });
                    }
                })

            // supprimer les commentaires du user
            db.commentaires.findAll({ where: { userId: req.params.id } })
                .then(commentaires => {
                    // pas de commentaires
                    if (! commentaires) { console.log("Pas de commentaire de ce user")}
                    // commentaires trouvé
                    else {
                        db.commentaires.destroy({ where: { userId: req.params.id } });
                    }
                })
            
            // chercher les publications de ce user
            db.Posts.findAll({ where: { userId: req.params.id } })
                .then((posts) => {
                    //si user n'a pas de publication
                    if (!posts) {
                        console.log("user n'a pas de publication")
                    }
                    else {
                        // chercher les images, video et effacer
                        for ( let i=0; i<posts.length; i++) {
                            if (posts[i].img_url !="") {
                            let filenames = posts[i].img_url
                            fs.unlink(`images/${filenames}`, () => {console.log("images supprimé");});
                            }
                        }
                        
                        db.Posts.destroy({ where: { userId: req.params.id } })
                    }     
                    
                })
        
        // supprimer ce user
        .then( () => {
            db.Users.destroy ({where: {id:req.params.id}})
            .then( () => res.status(200).json("utilisateur supprimé par admin"))
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
              return res.status(400).json("Vous n'êtes pas admin, vous ne pouvez pas modifier les utilisateurs")
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
                      return  res.status(400).json( { message: "Password incorrect"})
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
                                {expiresIn: "1m",});
                                    
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
    
    let newFonction = "";

    // Chercher user avec son ID
    db.Users.findOne ({ where: {id: req.params.id}} )
        .then( user => {
            // si update avec photo avatar
            if (req.file) {
                const file = user.avatar;
                // si avatar du user est "avatar_default"; on fait rien
                if( file.includes("avatar_default.png")) {
                    console.log("file avatar_default rien à effacer");
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
                    .then( () => { console.log("Update avatar réussi dans la table Users")})
                    .catch(err => {
                        console.log(err);
                        res.status(500).json( {message: "Problème pour update avatar"})
                    })
                
                // Puis update avatar dans BDD de commentaires
                db.commentaires.findOne( {where:{userId: req.params.id} })
                    .then( commentaire => {
                        db.commentaires.update( {
                            ...commentaire,
                            userAvatar: req.file.filename},
                            { where: {userId: req.params.id}})
                            .then( () => {console.log("Update avatar réussi dans la table commentaires")})
                            .catch( err => { 
                                console.log(err);
                                res.status(500).json("Problème update avatar dans la table commentaires")
                            })
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json("Problème chercher ce user dans la table commentaires")
                    })
                
                
            }
            
            //si update avec email: vérifier si email est déjà utilisé dans BDD?
            if (req.body.email.length >0 && req.body.email !="undefined") {
                console.log("Il y a email dans update");

                // valider email s'il est bon
                if( !validator.isEmail(req.body.email)) {return res.status(400).json({message: " Email invalid"})}
                // crypter email entrée afin de comparer avec celui dans BDD
                else {
                    let emailLogin = encrypt(req.body.email)
                    console.log("emailLogin " + emailLogin)
                    db.Users.findOne({where: {email: emailLogin}})
                        .then( user => {
                            // si email est déjà utilisé, envoyer 400
                            if (user) {return res.status(400).json({message: "Email déjà utilisé"})}

                            // si email n'est pas encore dans BDD, update user avec nouvel email
                            
                            db.Users.update({...user, email: emailLogin}, {where: {id:req.params.id}})
                                .then( () => { console.log("Update email réussi")})
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json( {message: "Problème pour update email"})
                                })
                        })
                        .catch( err => { console.log(err); res.status(500).json("Problème chercher email");})
                }
                
            }

            //si update avec pseudo: vérifier si pseudo est déjà présenté dans BDD?
            if (req.body.pseudo.length >0 && req.body.pseudo !="undefined") {
               
                db.Users.findOne({where: {pseudo:req.body.pseudo}})
                    .then( user => {
                        // si pseudo est déjà utilisé, envoyer 400
                        if (user) {return res.status(400).json({message: "Pseudo déjà utilisé"})}

                        else {
                            // si pseudo n'est pas dans BDD, valider le pseudo entrée
                            if (!validator.matches(req.body.pseudo, /^[a-z0-9éèàùûêâôë][a-z0-9éèàùûêâôë '-]+$/i)) {return res.status(400).json({message: " Pseudo doit être en lettre ou chiffre"})}
                        
                            // update user avec pseudo dans la table Users
                            newPseudo = req.body.pseudo;
                            db.Users.update( {...user, pseudo: newPseudo}, {where: {id:req.params.id}})
                                .then( () => {console.log("Update pseudo réussi")})
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json( {message: "Problème pour update pseudo dans la table Users"})
                                })
                            // update nouveau pseudo dans la table commentaires
                            db.commentaires.findOne({where: {userId:req.params.id}} )
                                .then( commentaire => {
                                    db.commentaires.update( {...commentaire, userPseudo: newPseudo}, {where: {userId:req.params.id}})
                                    .then( () => { console.log("Update pseudo dans la table commentaires")})
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).json( {message: "Problème pour update pseudo dans la table commentaires"})
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json( {message: "Problème pour chercher pseudo dans la table commentaires"})
                                })
                            
                        }
                    })
                    .catch( err => { console.log(err); res.status(500).json("Problème pour chercher pseudo")})
            }

            // si update avec fonction:
            if(req.body.fonction.length >0 && req.body.fonction !="undefined") {
                if ( !validator.matches(req.body.fonction, /^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i)) { return res.status(400).json({message: " Fonction doit être en lettre et pas de charactèrs spéciaux"})}
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
            if(! user) {return res.status(404).json({message: "Utilisateur non trouvé"}
            )}
            // user trouvé => envoyer la response avec user
            else {
                console.log("email " + user.email)
                let emailDecrypt = decrypt(user.email)
                
                let currentUser = {
                    userNom: user.nom,
                    userId: user.id,
                    userPseudo: user.pseudo,
                    email: emailDecrypt,
                    avatar: user.avatar,
                    isAdmin: user.isAdmin
                }
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
            if(user.isAdmin === false) {return res.status(400).json("Vous n'êtes pas admin")}
            else {
            // si user est admin, chercher tous les user, trier par id 
                db.Users.findAll( {
                    attributes: ["id","nom", "prenom", "pseudo", "createdAt", "isAdmin"]
                },
                {order: ["id"] })
                    .then((users) => {
                        if (! users) {return res.status(404).json({ message:"Utilisateur non trouvé" })}
                        
                        res.status(200).json({ users})
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
    // encrypt email entrée
    let emailLogin = encrypt(req.body.email)

    // comparer ce email avec celui dans BDD user based on email
    const user = await db.Users.findOne ( { where: {email: emailLogin } })
    try {
        // user pas trouvé
        if ( ! user ) {return res.status(404).json({ message: " Utilisateur non trouvé avec email "})}

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
                    email: emailLogin,
                    createPasswordResetToken: resetTokenHash
                },
                {where: { email: emailLogin} }
                )
                .then( () => { console.log(" Reset Token réussi")})
                .catch( error => {
                    res.status(404).json({message: "Problème pour update token user"});
                    console.log(error);
                } )
                
            // 3) Send token to user email
            const resetURL = `${req.protocol}://${process.env.GROUPO_HOST}/reset/${resetToken}`;
                // avec ce message, format HTML
            const message = `<p>Password oublié? Cliquez sur ce link pour changer votre password (valabe pour 1 heure) </p> <br> <a href="${resetURL}">${resetURL}</a>  <br> Si ce n'est pas le cas, ignorez ce message</p>`  ;

            // envoyer email à user 
            await sendEmail( {
                email: req.body.email,
                subject: "Groupomania, reset password ( valide pour 2 heures )",
                message
            })
                .then( () => {return res.status(200).json( { message: "Verifier votre email pour reset password"})}) 
                .catch ( err => {
                    console.log(err)
                    res.status(500).json({ message: "Problème pour envoyer email"})
                // en cas de pb d'envoie, réinitialiser le colonne resetPassword à undefined
                    db.Users.update (
                        {...userObject,
                            email: emailLogin,
                            createPasswordResetToken: 'undefined'
                        },
                        {where: { email: emailLogin} }
                        )
                        .then( () =>console.log(" ResetToken effacé") )
                        .catch( (e) =>{console.log(e);res.json({message: "Problème pour effacé resetToken user"})}) 
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
               return res.status(400).json({message: "token expired"})
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
                           return res.status(400).json({ message: "Token invalid, user non trouvé"})
                        }
                    else {
                        // valider password avec password-validator
                        if(!schema.validate(req.body.password)) {return res.status(400).json({message: " Password doit avoir 8 et 20 characters, 1 majuscule, 1 minuscule, 1 symbol"})}
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
                                    {expiresIn: "1m",});
                                        
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
