const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

const router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/sign-up', (req, res) => res.render('signUp', { user: req.user }));
router.post('/sign-up', [
  check('firstname')
    .isLength({ min: 3 })
    .withMessage('Minimum 3 charcters required!')
    .escape(),
  check('lastname')
    .isLength({ min: 3 })
    .withMessage('Minimum 3 charcters required!')
    .escape(),
  check('email').normalizeEmail().isEmail().escape(),
  check('password').escape(),
  check('passwordconfim')
    .exists()
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signUp', { errors: errors.array() });
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

router.get('/log-in', (req, res) => res.render('logIn', { user: req.user }));
router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
  }),
);

router.get('/log-out', (req, res, next) => {
  req.logout((err) => (err ? next(err) : res.redirect('/')));
});

module.exports = router;
