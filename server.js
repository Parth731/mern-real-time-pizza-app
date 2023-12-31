require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const connectToDB = require('./app/config/database');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');

// constant
const app = express();
const PORT = process.env.PORT || 3300;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Database connection
connectToDB();

// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_URL,
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
    // cookie: { maxAge: 1000 * 15 }, // 15 second
  })
);
// app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.json());

// gobal middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// routes
require('./routes/web')(app);

app.listen(PORT, () => {
  console.log(`listing on port ${PORT}`);
});
