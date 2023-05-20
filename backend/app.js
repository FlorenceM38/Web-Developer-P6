//framword pour aider à la création et gestion du server node
const express = require('express');

// création de l'application express
const app = express();

//lien avec entre la bdd et le server
const mongoose = require('mongoose');


//chemin serveur
const path = require('path');

//import dotenv pour les variables d'environnement
require('dotenv').config();

//package pour rajouter de la sécurité à express avec des en-têtes http
const helmet = require('helmet');

//import des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

//acces à l'api avec les headers définis
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//mongoose
mongoose.connect(`mongodb+srv://${process.env.USER_MONGOBDD}:${process.env.PASSWORD_MONGOBDD}@piquante.dp4hdvk.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//configuration de helmet pour la sécurité
app.use(helmet.contentSecurityPolicy({directives: {
  ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  'img-src': ["'self", '*'],
}}))


//middelware pour intercepter toutes les requêtes qui contiennent du json et qui le met à dispo sur l'objet requete dans req.body
app.use(express.json())

//routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

