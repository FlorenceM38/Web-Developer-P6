const express = require('express');
const router = express.Router();


const sauceCtrl = require('../controllers/sauces')

router.post('/', sauceCtrl.createSauce);

router.put('/:id', sauceCtrl.modifySauce);
  
  router.delete('/:id', (req, res, next) => {
    sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message : 'sauce supprimée'}))
    .catch(error => res.status(400).json({ error }));
  });
  
  router.get('/:id', (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  });
  
  router.get('/', (req, res, next) => {
    sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  });
  


  module.exports = router;
