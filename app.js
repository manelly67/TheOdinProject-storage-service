const path = require('node:path');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

const appRoutes = require('./routes/appRoutes');
const express = require('express');
/* const session = require('express-session'); */
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

const passport = require('passport');

const app = express();
// to define the view engine and path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Equals 1 day - 24hrs/1day - 60min/1hrs - 60seg/1min - 1000ms/1seg
      },
      secret: 'some secret',
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

// se debe inicializar cada sesion
app.use(passport.initialize());
app.use(passport.session());

// middleware and to serve static assets
app.use(express.static('public'));

//si no se utiliza esta middleware el post object resulta undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If you insert this code somewhere between
//where you instantiate the passport middleware and before you render you views
//you will have access to the currentUser variable in all of your views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});



// routes
app.use('/', appRoutes);

//404 page
app.use((req, res) => {
  res
    .status(404)
    .render('404', { title: 'Error Page' });
});

app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
  });