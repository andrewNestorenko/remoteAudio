var url = require('url');
module.exports = function(req, res, next) {
    var srvUrl = url.parse(req.url);
    res.locals.uri = srvUrl.path;
    next();
}