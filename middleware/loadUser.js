module.exports = function (req, res, next) {
    res.locals.user = null;
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
}