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