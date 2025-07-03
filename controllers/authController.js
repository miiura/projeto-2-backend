const User = require('../models/User');

// Garante que o usuário admin existe
async function ensureAdmin() {
  const admin = await User.findOne({ email: 'admin@utfpr.edu.br' });
  if (!admin) {
    await User.create({ email: 'admin@utfpr.edu.br', password: 'admin1234' });
  }
}

// Renderiza a página de login
exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

// Realiza o login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.render('login', { error: 'Email ou senha inválidos.' });
  }
  req.session.userId = user._id;
  res.cookie('user', user.email, { maxAge: 1000 * 60 * 60 * 2 });
  res.redirect('/agenda');
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('user');
    res.redirect('/login');
  });
};

// Middleware de proteção
exports.requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Inicializa admin ao iniciar o app
ensureAdmin();
