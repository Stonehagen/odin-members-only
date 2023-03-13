const express = require('express');
const bcrypt = require('bcryptjs');
const { body, check, validationResult } = require('express-validator');

const router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Clubhouse' });
});

router.get('/sign-up', (req, res) => res.render('signUp'));
router.post('/sign-up', [
  check('firstname').exists(),
  check('lastname').exists(),
  check('email').normalizeEmail().isEmail(),
  check('password').exists(),
  check('passwordconfim')
    .exists()
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(errors);
      return;
    }
    bcrypt
      .hash(req.body.password, 10)
      .then((hashedPassword) => {
        const user = new User({
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          email: req.body.email,
          memberstatus: false,
          password: hashedPassword,
        });
        return user.save();
      })
      .then(() => res.redirect('/'))
      .catch((err) => next(err));
  },
]);

module.exports = router;
