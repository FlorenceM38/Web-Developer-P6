//import du package de cryptage pour les mdp
const bcrypt = require('bcrypt');

//import du package pour les token
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//fonction pour créer un nouvel utilisateur en bdd
exports.signup = (req, res, next) => {
    //fonction pour hacher le mdp
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        //création du nouvel utilisateur avec email et mdp haché
        const user = new User({
            email: req.body.email,
            password: hash
        });
        //enregistrement de l'utilisateur en bdd
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};



//fonction pour se connecter, verifier si il existe et si le mdp est ok 
exports.login = (req, res, next) => {
    //filtre pour vérifier le mail transmis par l'utilisateur
    User.findOne({email: req.body.email})
    .then(user => {
        //si on ne trouve pas l'utilisateur avec son adresse mail
        if (user === null) {
            res.status(401).json({message: 'identifiant ou mot de passe incorrecte'});
        } else {
            //on appelle la fonction compare de bcrypt pour vérifier le mdp dans le cas ou l'adresse mail saisie existe bien en bdd
            bcrypt.compare(req.body.password, user.password)
            .then(valide => {
                //si false c'est une erreur d'authentification, le mdp n'est pas le bon
                if (!valide) {
                    res.status(401).json({message: 'identifiant ou mot de passe incorrecte'});
                } //sinon si le mdp est bon on retourne un objet qui contient les infos du client, user id et token
                else {
                    res.status(200).json({
                        userId: user._id,
                        //appel de la fonction sign avec comme argument les données à encoder, la clé pour l'encodage et le temps de validité du token 
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                }

            })
            .catch(error => {
                res.status(500).json({ error });
            })
        }
    })
    .catch(error => res.status(500).json({ error }))

};