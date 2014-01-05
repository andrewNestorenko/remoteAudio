var auth = require('libs/auth');
module.exports = {
    get: function(req, res) {
        req.logout();
        res.redirect('/');
    }
}