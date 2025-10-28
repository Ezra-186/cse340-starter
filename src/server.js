const path = require('path');
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const morgan = require('morgan');
require('dotenv').config();
const pool = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3000;

// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// logs + parsers
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session in Postgres (auto-create table on first run)
app.use(session({
  store: new PgSession({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 }
}));

// routes
app.use('/', require('./routes/index'));

// dev-friendly error page
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error. Check the logs.');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
