//import du package pour les token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try{
        //on récupere le token en récupérant le header et en le splitant donc on diviant la chaine de caractère en un tableau et on récupère le taken en deuxième position
        const token = req.headers.authorization.split(' ')[1]; 
        //on le décode ensuite avec la méthode verify 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //on récupère le user Id
        const userId = decodedToken.userId;
        //et on ajoute cette valeur a l'objet request qui est transmi au routes
        req.auth = {
            userId: userId
        };

    } catch(error) {
        res.status(401).json({ error });
    }
};