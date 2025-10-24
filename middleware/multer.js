const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

const multerSharp = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) return next();

    try {
        
      const compressedPath = `images/compressed_${req.file.filename}`;
      
      await sharp(req.file.path)
        .resize(800)                
        .jpeg({ quality: 80 })      
        .toFile(compressedPath);
      
      
      fs.unlinkSync(req.file.path);
      
      
      req.file.filename = 'compressed_' + req.file.filename;
      next();
    } catch (error) {
      console.error('Erreur Sharp :', error);
      res.status(500).json({ error: 'Erreur de compression image' });
    }
  });
};

module.exports = multerSharp;