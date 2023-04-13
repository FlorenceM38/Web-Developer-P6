//framword pour aider à la création et gestion du server node
const express = require('express');

// création de l'application express
const app = express();

//lien avec entre la bdd et le server
const mongoose = require('mongoose');

//import des routes
const userRoutes = require('./routes/user')

//acces à l'api avec les headers définis
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//mongoose
mongoose.connect('mongodb+srv://florencemaffini:xmXxKIFZs5vBxSed@piquante.dp4hdvk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())
//routes
app.use('/api/auth', userRoutes);

module.exports = app;

