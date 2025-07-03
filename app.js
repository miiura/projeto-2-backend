const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/agenda-eletronica', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sessions
app.use(session({
  secret: 'segredoagenda',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/agenda-eletronica' }),
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// Rotas
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
