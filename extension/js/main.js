"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var player = document.createElement('audio');
    player.id = "html5_audio";
    document.body.appendChild(player);
    chrome.storage.local.get('enabled', function (result) {
        player.remoteAudioEnabled = result.enabled;
    });
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (changes.hasOwnProperty('localMute')) {
            player.muted = changes.localMute.newValue;
        }
        if (changes.hasOwnProperty('enabled')) {
            player.remoteAudioEnabled = changes.enabled.newValue;
            if (false == changes.enabled.newValue) {
                sendRemoteCommand('pause', {});
            } else {
                console.log('Player event is dispatched');
                player.dispatchEvent(new Event('play'));
                player.dispatchEvent(new Event('volumechange'));
                player.dispatchEvent(new Event('seeking'));
            }
        }
        if (changes.hasOwnProperty('volumeMultiplier')) {
            var e = new Event('volumechange');
            player.dispatchEvent(e);
        }
    });
    processPlayer(player);
});

var processPlayer = function (p) {
    p.addEventListener('play', function (e) {
        var src = this.src.substring(0, this.src.lastIndexOf('mp3') + 3);
        if (false == p.muted) {
            chrome.storage.local.get('localMute', function (value) {
                if (value.localMute) {
                    p.muted = 1;
                    console.log('Local audio is muted');
                }
            });
        }
        if (p.remoteAudioEnabled) {
            sendRemoteCommand('play', {url: src}, function () {
                console.log('Play is successfully send to server with url ' + src);
            });
        }
    });

    p.addEventListener('pause', function (e) {
        if (p.remoteAudioEnabled) {
            sendRemoteCommand('pause', {}, function () {
                console.log('Pause is successfully send to server');
            });
        }
    });
    p.addEventListener('volumechange', function (e) {
        if (p.remoteAudioEnabled) {
            var volume = p.volume;
            var i = [];
            i.indexOf();
            chrome.storage.local.get('volumeMultiplier', function (result) {
                var volumeMultiplier = parseFloat(result.volumeMultiplier);
                if (!volumeMultiplier || volumeMultiplier == 0 || volumeMultiplier > 1) {
                    volumeMultiplier = 1;
                }
                volume = (volume * volumeMultiplier);
                sendRemoteCommand('volumechange', {volume: volume }, function () {
                    console.log('Volumechange is successfully send to server with value ' + volume);
                });
            });

        }
    });
    p.addEventListener('seeking', function (e) {
        if (p.remoteAudioEnabled) {
            sendRemoteCommand('seeking', {currentTime: this.currentTime}, function () {
                console.log('Seeking is successfully send to server');
            })
        }
    });
};

function sendRemoteCommand(command, extraData, success, error) {
    extraData['command'] = command;
    var params = [];
    for (var key in extraData) {
        params.push(key + '=' + extraData[key]);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (typeof success == "function") {
                success();
            }
        }
    };
    xhr.open("POST", 'http://remote.nestorenko.info:3000', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params.join('&'));
}