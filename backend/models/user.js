//import de mongoose
const mongoose = require('mongoose');

//on ajoute en package le validateur comme plugin à notre schéma pour s'assurer qu'on ne puisse pas s'inscrire deux fois avec la même adresse mail
const uniqueValidator = require('mongoose-unique-validator');

//création du schéma et des infos à stocker
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

//on applique au schéma
userSchema.plugin(uniqueValidator);

//export du schéma sous forme de modèle
module.exports = mongoose.model('user', userSchema);