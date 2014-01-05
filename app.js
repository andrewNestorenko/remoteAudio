var config = require('./config');
var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var server = http.createServer(app);
var io = require('./libs/socket')(server);
var swig = require('swig');
var passport = require('passport');
var auth = require('./libs/auth');

app.configure(function() {
    server.listen(config.get('app:port'));
    app.use(express.cookieParser());
    app.use(express.session({secret: "test123"}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require('./middleware/loadUser'));
    app.use(require('./middleware/navigation'));
//    app.set('io', io);
    app.engine('swig', swig.renderFile);
    app.use(express.static('public'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'swig');
    app.set('basepath', __dirname);
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.logger('dev'));
    app.set('view cache', false);
    // To disable Swig's cache, do the following:
    swig.setDefaults({ cache: false });
});

app.get('/', require('./routes/index').get);
app.post('/command', require('./routes/index').post);
app.get('/player', require('./routes/player').get);
app.get('/contacts', require('./routes/contacts').get);

app.get('/login', require('./routes/user/login').get);
app.get('/logout', require('./routes/user/logout').get);
app.get('/profile', require('./middleware/checkPermissions'), require('./routes/user/profile').get);

app.get('/auth/vkontakte',
    passport.authenticate('vkontakte', {scope: ['audio']}),
    function(req, res){
        // The request will be redirected to vk.com for authentication, so
        // this function will not be called.
        res.setStatus(404);
        res.end('error');
    }
);

app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log('auth done');
        res.redirect('/');
    }
);


app.get(
    '/user/download-collection',
    require('./middleware/checkPermissions'),
    require('./routes/user/download').get
);

app.use(function(err, req, res, next) {
    if (!err) next();
    res.statusCode = 500;
    res.end(err.message);
});
