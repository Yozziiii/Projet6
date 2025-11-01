const express = require('express');
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/book')
const multerSharp = require('../middleware/multer')

const router = express.Router();

router.post('/:id/rating', auth ,bookCtrl.rating);   
router.post('/', auth , multerSharp, bookCtrl.createBook );
router.put('/:id', auth , multerSharp, bookCtrl.modifyBook );
router.delete('/:id', auth ,bookCtrl.deleteBook); 
router.get('/bestrating',bookCtrl.getBestRating);
router.get('/:id',bookCtrl.getOneBook);   
router.get('/',bookCtrl.getAllBook);
  

module.exports = router;