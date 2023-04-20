const express = require('express');
const router = express.Router();

//import du middleware auth
const auth = require('../middleware/auth');

//import du middleware multer
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces')

router.post('/', auth, multer, sauceCtrl.createSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);
  
router.delete('/:id', auth, sauceCtrl.deleteSauce);
  
router.get('/:id', auth, sauceCtrl.getOneSauce);
  
router.get('/', auth, sauceCtrl.getAllSauces);
  


module.exports = router;
