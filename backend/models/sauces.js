//import de mongoose
const mongoose = require('mongoose');

//création du schéma et des infos à stocker
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // l'id de l'utilisateur qui a créé la sauce
    name: { type: String, required: true }, //le nom de la sauce
    manufacturer: { type: String, required: true }, //le fabriquant de la sauce
    description: { type: String, required: true }, //la description de la sauce
    mainPepper: { type: String, required: true }, //les ingrédients de la sauce
    image: { type: String, required: true }, //l'url de l'image de la sauce
    heat: { type: Number, required: true }, //le niveau de piquant de la sauce

})

//export du schéma sous forme de modèle
module.exports = mongoose.model('sauce', sauceSchema);