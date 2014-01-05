module.exports = function(server) {
    var io = require('socket.io').listen(server)
    io.set('transports', [
        "websocket",
        "xhr-polling",
        "htmlfile"
    ]);

//    io.set('authorization', function(handshake, callback) {
//
//    });

    io.sockets.on('connection', function (socket) {
        console.log('User is joined');
    });

    io.sockets.on('disconnect', function(socket) {
        cosole.log('User has disconnected!');
    });

    return io;
};

