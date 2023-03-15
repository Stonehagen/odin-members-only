const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/log-in');
};

/* GET home page. */
router.get('/', (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.render('index', { posts, user: req.user });
    })
    .catch((err) => next(err));
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

router.post('/newMessage', checkAuthenticated, [
  check('message')
    .isLength({ min: 10 })
    .withMessage('Minimum 10 charcters required!')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('/', { errors: errors.array(), message: req.body.message });
      return;
    }
    // find User
    const title = `${req.body.message.substring(0, 20)}...`;
    const author = `${req.user.firstName} ${req.user.lastName}`;
    const post = new Post({
      title,
      text: req.body.message,
      author,
    });
    post
      .save()
      .then(() => res.redirect('/'))
      .catch((err) => next(err));
  },
]);

module.exports = router;
