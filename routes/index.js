exports = module.exports = {
    get: function(req, res, next) {
        res.locals.user = req.user;
        res.render('index');
    },

    post: function(req, res, next) {
        var url = req.body.url;
        app.get('io').sockets.emit('command', req.body);
        res.end('');
    }
}