const multer = require('multer');

const MIME_TYPE = {
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
// var maxSize = 15*1000*1000           // 15Mo environ 1 video de 2 minutes
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

module.exports = multer ({storage: storage}).single("image")

function mimetypeValid(extension, req) {
    if( extension!='jpg' && extension !='png' && extension != 'jpeg' && extension != 'gif' && extension != 'wav' && extension != 'flv' && extension != 'mp4' && extension != 'mov' && extension != 'avi' && extension != 'wmv' && extension != 'movie') 
    {
        req.body.errorMessage = "Le format d'image n'est pas valid!"
    }
}