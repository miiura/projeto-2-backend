const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Página protegida
router.get('/agenda', authController.requireLogin, (req, res) => {
  res.render('agenda', { user: req.cookies.user });
});

// Redireciona raiz para login
router.get('/', (req, res) => res.redirect('/login'));

module.exports = router;
