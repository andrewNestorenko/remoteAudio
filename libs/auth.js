var passport = require('passport'),
    passportVk = require('passport-vkontakte').Strategy,
    User = require('models/user').User,
    swig = require('swig'),
    config = require('nconf');

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.profileId);
});

passport.deserializeUser(function(profileId, done) {
    User.findOne({profileId: profileId}, function(err, user) {
        done(err, user);
    });
});

passport.use(
    new passportVk({
            clientID:     config.get('passport:vk:clientId'),
            clientSecret: config.get('passport:vk:clientSecret'),
            callbackURL:  config.get('passport:vk:callbackURL')
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({profileId: profile.id}, function (err, user, affected) {
                if (err || !user) {
                    user = new User({
                        username: profile.username,
                        profileId: profile.id,
                        password: 'test123',
                        rawUser: profile,
                        accessToken : accessToken,
                        refreshToken : refreshToken
                    });
                    user.save(function(err, user) {
                        if (err) throw err;
                        done(null, user);
                    });
                }
                done(null, user);
            });
        })
);



module.exports = passport;