//import de multer
const multer = require('multer');

//dictionnaire des extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

//objet de configuration pour multer
const storage = multer.diskStorage({
    //dans quel dossier enregistrer les dossiers
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //le nom du fichier avec une méthode split pour remplacer les espaces par des _ 
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        //ajout de l'extension au fichier
        const extension = MIME_TYPES[file.mimetype];
        //appel du callback nom+time+.+extension du fichier
        callback(null, name + Date.now() + '.' + extension);

    }
});

//export du middleware 
module.exports = multer({ storage }).single('image');