require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const db = require('./config/db');
const path = require('path');

app.use(express.static('public'));

app.use(session({
  secret: '3hf2f82f328hf7', 
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


db.connect()
  .then(() => {




    console.log('--> Conectado ao banco de dados PostgreSQL');

    app.use(express.json());

    app.use((req, res, next) => {
      res.locals.userId = req.session.userId || null;
      next();
    });

    app.use('/css', express.static(path.join(__dirname, 'views', 'css')));

    app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

    const frontendRoutes = require('./routes/frontRoutes');
    app.use('/', frontendRoutes);

    const routes = require('./routes/index');
    app.use('/', routes);

    app.use((req, res, next) => {
      res.status(404).send('Página não encontrada');
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Erro no servidor');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\n--> Servidor rodando na porta ${PORT}`);
      console.log(`\n--> Acesse a aplicação web em: \x1b[36m\x1b[4mhttp://localhost:${PORT}\x1b[0m`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });