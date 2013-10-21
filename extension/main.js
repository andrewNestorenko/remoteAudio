document.addEventListener('DOMContentLoaded', function () {
    var player = document.createElement('audio');
    player.id = "html5_audio";
    document.body.appendChild(player);
    processPlayer(player);
});

processPlayer = function (p) {
    p.addEventListener('play', function (e) {
        var src = this.src;
        if (false == p.muted) {
            this.muted = 1;
            console.log('Local audio is muted');
        }
        sendRemoteCommand('play', {url: src}, function() {
            console.log('Play is successfully send to server');
        });
    });

    p.addEventListener('pause', function (e) {
        sendRemoteCommand('pause', {}, function() {
            console.log('Pause is successfully send to server');
        })
    });
    p.addEventListener('volumechange', function (e) {
        sendRemoteCommand('volumechange', {volume: this.volume}, function() {
            console.log('Volumechange is successfully send to server');
        })
    })
}


function sendRemoteCommand(command, extraData, success, error) {
    extraData['command'] = command;
    var params = [];
    for (var key in extraData) {
        params.push(key + '=' + extraData[key]);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(xmlh) {
        if (xmlh.readyState == 4 && xmlh.status == 200) {
            if(typeof error == "function") {
                success();
            }
        }
    };
    xhr.open("POST", 'http://remote.nestorenko.info:3000', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params.join('&'));
}