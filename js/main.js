document.addEventListener('DOMContentLoaded', function () {
    window.player = new Player();
    player.init();
    document.getElementById("player-holder").appendChild(player.render());
});
var socket = io.connect('http://remote.nestorenko.info:3000');
socket.on('command', function (data) {
    player.processCommand(data);
});

var Player = function () {
    return {
        init: function () {
            this.player = new Audio();
            this.player.controls = true;
            console.log('player is initialized');
        },

        render: function () {
            return this.player;
        },

        playSrc: function (src) {
            if (src == this.player.src) {
                this.play();
            } else {
                this.pause();
                this.player.src = src;
                this.play();
            }
            return this;
        },

        play: function () {
            if (this.player.paused) {
                this.changeVolumeTo(0).changeVolumeTo(this.player.volume);
                this.player.play();
            }
            return this;
        },

        next: function () {
        },

        pause: function () {
            this.player.pause();
        },

        mute: function (flag) {
            if (typeof flag !== "undefined") {
                this.play().muted = !!flag;
            } else {
                if (false == this.player.muted) {
                    this.player.muted = true;
                }
            }

            return this;
        },

        processCommand: function (data) {
            console.log("Command has been received");
            console.log(data);
            switch (data.command) {
                case "play":
                    if (typeof data.url === 'string') {
                        this.playSrc(data.url);
                    } else {
                        this.play();
                    }
                    break;
                case "pause":
                    this.pause();
                    break;
                case "volumechange":
                    this.changeVolumeTo(data.volume);
                    break;
                case "mute":
                    this.mute();
                    break;
                case "unmute":
                    this.mute(false);
                    break;
                case "seeking":
                    this.seek(data.currentTime);
                    break;
            }
        },

        seek: function (time) {
            this.player.currentTime = time;
            return this;
        },

        changeVolumeTo: function (vol) {
            this.player.volume = parseFloat(vol);
            return this;
        }
    }
};