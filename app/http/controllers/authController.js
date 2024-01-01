const passport = require('passport');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

const authController = () => {
  const _getRedirectUrl = (req) => {
    console.log(req.user);
    return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders';
  };
  return {
    login: (req, res) => {
      res.render('auth/login');
    },
    postLogin: (req, res, next) => {
      const { email, password } = req.body;
      // Validate request
      if (!email || !password) {
        req.flash('error', 'All fields are required');
        return res.redirect('/login');
      }
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }

        if (!user) {
          req.flash('error', info.message);
          return res.redirect('/login');
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },
    register: (req, res) => {
      res.render('auth/register');
    },
    postRegister: async (req, res) => {
      try {
        const { name, email, password } = req.body;
        // Validate request
        if (!name || !email || !password) {
          // return res.status(400).json({ message: 'All fields are required' });
          req.flash('error', 'All fields are required'); //status code 400
          req.flash('name', name);
          req.flash('email', email);
          return res.redirect('/register');
        }

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // return res.status(400).json({ message: 'Email already exists' });
          req.flash('error', 'Email already taken');
          req.flash('name', name);
          req.flash('email', email);
          return res.redirect('/register');
        }
        //   User.exists({ email: email }, (err, result) => {
        //     console.log(result);
        //     if (result) {
        //       req.flash('error', 'Email already taken');
        //       req.flash('name', name);
        //       req.flash('email', email);
        //       return res.redirect('/register');
        //     }
        //   });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a user
        const user = new User({
          name,
          email,
          password: hashedPassword,
          mainpassword: password,
        });

        user.save();
        // res.status(200).json({ message: 'Registration successful' });
        return res.redirect('/login');
      } catch (err) {
        req.flash('error', 'Something went wrong');
        // res.status(500).json({ message: 'Internal Server Error' });
        return res.redirect('/register');
      }
    },
    logout: (req, res) => {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/login');
      });
    },
  };
};

module.exports = authController;
