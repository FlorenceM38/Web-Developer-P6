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
  sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //si l'userId qu'on recupère en bdd est différent de l'user id qu'on recupère de notre token
      if (sauce.userId != req.auth.userId) {
        //erreur d'authentification
        res.status(401).json({ message: 'non autorisé' });
      }
      //sinon on met à jour donc on passe un filtre qui va dire quel enregistrement mettre à jour et avec quel objet
      else {
        sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce modifiée' }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(400).json({ error }));
};


exports.deleteSauce = (req, res, next) => {
  //on vient recuperer notre objet en bdd
  sauce.findOne({ _id: req.params.id })
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