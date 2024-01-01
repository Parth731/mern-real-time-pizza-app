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
const passport = require('passport');
const Emitter = require('events');

// constant
const app = express();
const PORT = process.env.PORT || 3300;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Database connection
connectToDB();

// Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

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

// Passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Assets
app.use(express.static('public'));
// jab koi data hamare pass aata hai tab different form me hota hai jese ki json,urlencoded aor usko unable karane keliye following line use karani hai
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// gobal middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// routes
require('./routes/web')(app);
app.use((req, res) => {
  res.status(404).render('errors/404');
});

const server = app.listen(PORT, () => {
  console.log(`listing on port ${PORT}`);
});

// socket io server
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  // join

  socket.on('order_join', (orderId) => {
    socket.join(orderId);
  });
});

//emitter listening from status controller(for statusupdate)
eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated1', data);
});

// emitter listening from ordercontroller for orderplaced
eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced_admin', data);
});
