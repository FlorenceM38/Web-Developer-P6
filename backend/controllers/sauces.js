const { log } = require('console');
const Sauce = require('../models/sauces');
const fs = require('fs');


exports.createSauce = (req, res, next) => {

  //on parse l'objet pour pouvoir s'en servir
  const sauceObjet = JSON.parse(req.body.sauce);
  //on supprime l'id qui sera généré par notre bdd
  delete sauceObjet._id;
  //on supprime le userId pour des raisons de sécurité
  delete sauceObjet._userId;

  //creation d'une nouvelle instance de sauce
  const sauce = new Sauce({
    ...sauceObjet,
    userId: req.auth.userId,
    //construction de l'url
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'sauce enregistrée' }))
    .catch(error => res.status(400).json({ error }));
};




exports.modifySauce = (req, res, next) => {
  //on vérifie si il y a un champ file 
  const sauceObjet = req.file ?

    // si c'est le cas on recupère notre objet en parsant la string et en recréant l'url de l'image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    //si ca n'est pas le cas on vient recupérer l'objet dans le corps de la requete
    : { ...req.body }
  //on supprime le userId pour des raisons de sécurité
  delete sauceObjet._userId;
  //on vient recuperer notre objet en bdd
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //si l'userId qu'on recupère en bdd est différent de l'user id qu'on recupère de notre token
      if (sauce.userId != req.auth.userId) {
        //erreur d'authentification
        res.status(401).json({ message: 'non autorisé' });
      }
      //sinon on met à jour donc on passe un filtre qui va dire quel enregistrement mettre à jour et avec quel objet
      else {
        //on recupere le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: req.params.id }, sauceObjet)
            .then(() => res.status(200).json({ sauce }))
            .catch(error => res.status(400).json({ error }));
        })
      }
    })
    .catch(error => res.status(400).json({ error }));

};


exports.deleteSauce = (req, res, next) => {
  //on vient recuperer notre objet en bdd
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //on vérifie que c'est bien le propriétaire de l'objet qui en demande la suppression
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'non autorisé' });
      } else {
        //on recupere le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'sauce supprimée' }))
            .catch(error => res.status(400).json({ error }));
        })


      }
    })
    .catch(error => res.status(500).json({ error }));


};


exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


exports.likeSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const userId = req.auth.userId;
      const like = req.body.like;
      console.log(like);

      //si l'utilisateur like
      if (like === 1) {
        //si il n'est pas dans le tableau des likes
        if (!sauce.usersLiked.includes(userId)) {
          //on fait la mise à jour de la sauce
          Sauce.updateOne({ _id: req.params.id },
            {
              //on rajoute l'id dans le tableau des utilisateurs qui ont deja likés la sauce 
              $push: { usersLiked: userId },
              //on rajoute un like sur le compteur
              $inc: { likes: +1 },
            })
            .then(() => res.status(200).json({ message: 'sauce likée' }))
            .catch(error => res.status(400).json({ error }));
        }
        //si l'utilisateur a deja liké la sauce
        else if (sauce.usersLiked.includes(userId)) {
          return res.status(401).json({ message: "sauce deja likée" })
        }
        //si l'utilisateur a deja disliké la sauce
        else if (sauce.usersDisliked.includes(userId)) {
          return res.status(401).json({ message: "sauce deja dislikée" })
        }
      }

      //si l'utilisateur dislike
      else if (like === -1) {
        //si il n'est pas dans le tableau des dislikes
        if (!sauce.usersDisliked.includes(userId)) {
          //on fait la mise à jour de la sauce
          Sauce.updateOne({ _id: req.params.id },
            {
              //on rajoute l'id dans le tableau des utilisateurs qui ont deja likés la sauce 
              $push: { usersDisliked: userId },
              //on rajoute un like sur le compteur
              $inc: { dislikes: +1 },
            })
            .then(() => res.status(200).json({ message: 'sauce dislikée' }))
            .catch(error => res.status(400).json({ error }));
        }

        //si l'utilisateur a deja disliké la sauce
        else if (sauce.usersDisliked.includes(userId)) {
          return res.status(401).json({ message: "sauce deja dislikée" })
        }
        //si l'utilisateur a deja liké la sauce
        else if (sauce.usersLiked.includes(userId)) {
          return res.status(401).json({ message: "sauce deja likée" })
        }
      }

      //si l'utilisateur clique sur le like ou dislike alors qu'il a déjà liké/disliké la sauce
      else if (like === 0) {
        //on retire le like et on enleve l'identifiant utilisateur du tableau des likes
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              //on enlève l'id utilisateur du tableau
              $pull: { usersLiked: userId },
              //on enlève le like
              $inc: { likes: -1 }
            }
          )
            .then(() => res.status(200).json({ message: 'like retiré' }))
            .catch(error => res.status(400).json({ error }));
        }

        //on retire le dislike et on enleve l'identifiant utilisateur du tableau des dislikes
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              //on enlève l'id utilisateur du tableau
              $pull: { usersDisliked: userId },
              //on enlève le dislike
              $inc: { dislikes: -1 }
            }
          )
            .then(() => res.status(200).json({ message: 'dislike retiré' }))
            .catch(error => res.status(400).json({ error }));
        }
      }
    })
};