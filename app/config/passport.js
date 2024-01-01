const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        // Login
        // check if email exists
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'No user with this email' });
        }
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { message: 'Logged in succesfully' });
            }
            return done(null, false, { message: 'Wrong username or password' });
          })
          .catch((err) => {
            console.log(err);
            return done(null, false, { message: 'Something went wrong' });
          });
      }
    )
  );

  // user id store in session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  //user data receive from database
  passport.deserializeUser(async (uid, done) => {
    // User.findById(uid, function (err, user) {
    //   done(err, user);
    // });
    try {
      const user = await User.find({ _id: uid });
      if (!user) {
        return done(null, false, { message: 'user can not find' });
      }
      done(null, user);
    } catch (error) {
      console.log(err);
      return done(null, false, { message: 'Something went wrong' });
    }
  });
}

module.exports = init;
