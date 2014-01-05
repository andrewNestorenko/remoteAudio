var fs = require('fs'),
    async = require('async'),
    https = require('https'),
    http = require('http'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

module.exports = {
    get: function(req, res, next) {
        var io = req.app.get('io');
        var zip = new require('node-zip')();
        async.waterfall([
            function(callback) {
                https.get('https://api.vk.com/method/audio.get?access_token=' + req.user.accessToken,function(resp) {
                    var mainBuffer = '';
                    resp.on('data',function(data) {
                        mainBuffer += data;
                    }).on('end', function() {
                        callback(null, mainBuffer)
                    });
                }).on('error', function(err) {
                    callback(err);
                });
            },
            function(responseData, callback) {
                var apiResponse = JSON.parse(responseData);
                var chunks = chunk(apiResponse.response, 5);
                var path = require('path').join(req.app.get('basepath'), 'downloads', req.user.get('profileId'));
                fs.stat(path, function(err, info) {
                    if (err) {
                        fs.mkdir(path);
                    }
                    var downloader = new Downloader(path);
                    var length = chunks.length;
                    var c = 0;
                    downloader.on('complete', function() {
                        console.log('song has been successfully downloaded')
                    });
                    downloader.on('finish', function() {
                        io.sockets.emit(
                            'grab-progress',
                            {
                                progress: parseInt((c * 5)/(length/100), 10)
                            }
                        );
                        console.log('all songs has been successfully downloaded')
                    });
                    var down = function(data, cb) {
                        downloader.download(data, function (err) {
                            if (err) cb(err);
                            if (c < length) {
                                down(chunks[++c]);
                            } else {
                                cb();
                            }
                        });
                    };
                    down(chunks[c], function(err) {
                        if (err) console.log(err);
                        callback();
                    });
                })
            }
            , function () {

            }
        ], function(err, data) {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    }
};


function chunk(input, size) {	// Split an array into chunks
    for (var x, i = 0, c = -1, l = input.length, n = []; i < l; i++) {
        (x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
    }
    return n;
}
function Downloader(basepath) {
    this.basepath = basepath;
    EventEmitter.call(this);
    return this;

}
util.inherits(Downloader, EventEmitter);
Downloader.prototype.download = function(data, callback) {
    if (!data) return;
    var toDownload = data.length
        , downloaded = 0;
    for (var i = 0; i < data.length; i++) {
        var that = this;
        (function() {
            var a = data[i]
                , fName = [a.artist, a.title].join(' - ') + '.mp3'
                , path = require('path').join(that.basepath, fName)
                , file = fs.createWriteStream(path, {flags: 'w'});
            file.on('error', function(err) {
                toDownload--;
                console.log(fName + ' have not been downloaded due to write file error!');
            });
            http.get(a.url,function(response) {
                response.pipe(file);
                response.on('end', function() {
                    file.close();
                    that.emit('complete');
                    downloaded++;
                    if (downloaded === toDownload) {
                        that.emit('finish');
                        if (callback) callback(null);
                    }
                });
            }).on('error', function(err) {
                console.log(err);
            });
        })();
    }
};

