const sauces = require('../models/sauces');


exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new sauce({
      ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message : 'sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
  }; 

exports.modifySauce = (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message : 'sauce modifiée'}))
    .catch(error => res.status(400).json({ error }));
   };

exports.deleteSauce = (req, res, next) => {
  sauce.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message : 'sauce supprimée'}))
  .catch(error => res.status(400).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};