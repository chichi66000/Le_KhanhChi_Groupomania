// middleware pour gérer les files images et video
const multer = require('multer');

const MIME_TYPE = {
    //mimetype pour image
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image.gif': 'gif',
    // mimetype pour video/audio
    'audio/x-wav': 'wav',
    'video/x-flv': 'flv',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/x-ms-wmv': 'wmv',
    'video/x-sgi-movie': 'movie'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0].split(' ').join('_');
        const extension = MIME_TYPE[file.mimetype];
        mimetypeValid(extension, req);
        const finalname = name + Date.now() + '.' + extension;// donner 1 nom unique
        callback(null, finalname )
    }
})
// stocker 1 seul image  la fois
module.exports = multer ({storage: storage}).single("image")

// fonction pour valider le mimetype
function mimetypeValid(extension, req) {
    if( extension!='jpg' && extension !='png' && extension != 'jpeg' && extension != 'gif' && extension != 'wav' && extension != 'flv' && extension != 'mp4' && extension != 'mov' && extension != 'avi' && extension != 'wmv' && extension != 'movie') 
    {
        req.body.errorMessage = "Le format d'image n'est pas valid!"
    }
}