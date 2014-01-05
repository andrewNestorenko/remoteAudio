var socket = io.connect('http://localhost:3000');

document.addEventListener( 'DOMContentLoaded', function () {
    document.getElementById('play').addEventListener('click', function() {
        socket.emit('server-command', { play:true });
    });

    document.getElementById('pause').addEventListener('click', function() {
        socket.emit('server-command', { pause: true });
    });
});
