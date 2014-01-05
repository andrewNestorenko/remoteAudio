module.exports = function(req, res, next) {
    if (!req.user) {
        res.statusCode = 403;
        res.redirect('/');
    } else {
      next();
    }
};