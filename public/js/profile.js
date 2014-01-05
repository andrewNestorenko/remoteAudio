document.querySelector('#grab-all').addEventListener('click', function (e) {
    var button = this;
    button.innerText = 'Downloading... please wait';
    button.disabled = true;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://remote.nestorenko.info:3000/user/download-collection', true);
    xhr.send();
    socket.emit('start-grab-collection');
    socket.on('grab-progress', function(data) {
        button.innerText = 'Downloading..' + data.progress + '%';
    });
});