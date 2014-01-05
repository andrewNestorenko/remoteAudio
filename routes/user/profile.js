module.exports = {
    get: function(req, res) {
        if (!req.user) throw new Error('You not allowed to be here!');
        res.render('user/profile');
    }
}