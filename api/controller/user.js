const mongoose = require('mongoose');
const User = require('../models/dbusers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((use) => {
      if (use.length >= 1) {
        res.status(409).json({ message: 'Mail exists' });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then(() => res.status(201).json({ message: 'User created' }))
              .catch(() => res.status(500).json({ error: 'Error created' }));
          }
        });
      }
    });
};
exports.get_user_all = (req, res) => {
  User.find()
    .select('email password _id ')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        Account: docs.map(data => ({
          email: data.email,
          password: data.password,
          _id: data._id,
        })),
      };
      res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ error: err }));
};
exports.delete_user_byId = (req, res) => {
  User.findOneAndRemove({ _id: req.params.id })
    .exec()
    .then(() => res.status(200).json({ message: 'User deteled' }))
    .catch(err => res.status(500).json({ error: err }));
};
exports.login = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          message: 'Auth failed',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) { return res.status(401).json({ message: 'Auth failed' }); }
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id,
          }, process.env.JWT_KEY, { expiresIn: '1h' });
          return res.status(201).json({
            message: 'Auth successful',
            token,
          });
        }
        res.status(401).json({ message: 'Auth failed' });
      });
    })
    .catch(err => res.status(401).json({ error: err }));
};
