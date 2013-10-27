var config = require('./config')
    , express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
;

console.log(config);

io.configure('production', function() {
    io.set('transports', [
        "websocket",
        "xhr-polling",
        "htmlfile"
    ]);
});

server.listen(3000);
app.use('/js', express.static(__dirname + '/js'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());

app.get('/', function(req, res) {
    console.log('index');
    app.render('index.jade', function(err, html) {
        res.end(html);
    })
});


app.post('/', function(req, res) {
    var url = req.body.url;
    io.sockets.emit('command', req.body);
    res.write('');
    res.end();
});

io.sockets.on('connection', function (socket) {
    console.log('User is joined');
//    socket.broadcast.emit('command')
});

//io.sockets.on('disconnect', function(socket) {
//    delete connections[connection.indexOf(socket)];
//});