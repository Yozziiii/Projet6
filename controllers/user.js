const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/user');


exports.signup = (req, res, next) => {
    const {email , password} = req.body;

    if (!email || validator.isEmpty(email.trim())) {
        return res.status(400).json({ message: 'Le champ email est requis.' });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Le champ email est pas valide' });
    }
    
    if (!password || validator.isEmpty(password)) {
      return res.status(400).json({ message: 'Le champ mot de passe est requis.' });
    }

    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => {
            if (error && error.code === 11000) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }
              res.status(400).json({ error })
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res , next) => {

    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!email || validator.isEmpty(email)) {
        return res.status(400).json({ message: 'Email requis.' });
    }
    if (!password || validator.isEmpty(password)) {
        return res.status(400).json({ message: 'Mot de passe requis.' });
    }

    User.findOne({email: req.body.email})
    .then(user => {
        if(user === null) {
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json( {error});
            })
        }
    })
    .catch(error => {
        res.status(500).json( {error} );
    })
}