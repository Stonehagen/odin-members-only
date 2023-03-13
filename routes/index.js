const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Clubhouse' });
});

router.get('/sign-up', (req, res) => {
  res.render('signUp');
});

module.exports = router;
