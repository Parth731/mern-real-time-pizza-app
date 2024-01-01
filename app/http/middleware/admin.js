function admin(req, res, next) {
  if (req.isAuthenticated() && req.user[0].role === 'admin') {
    return next();
  }
  return res.redirect('/');
}

module.exports = admin;
