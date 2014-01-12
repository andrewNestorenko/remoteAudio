var async = require('async')
    https = require('https')
    Downloader = require('libs/downloader');

module.exports = {
    get: function(req, res, next) {
        var io = req.app.get('io');
//        var zip = new require('node-zip')();
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

            function(httpResponse, callback) {
                try {
                    var apiResp = JSON.parse(httpResponse);
                    callback(null, apiResp.response);
                } catch(e) {
                    callback(e);
                }
            },

            function(responseData, callback) {
                var path = require('path').join(req.app.get('basepath'), 'downloads', req.user.get('profileId'));
                var downloader = new Downloader(path);
                var dataToDownload = [];
                responseData.forEach(function(a) {
                    var fName = [a.artist, a.title].join(' - ') + '.mp3';
                    dataToDownload.push({
                        'fileName' :fName,
                        'url' : a.url
                    });
                });
                downloader.download(dataToDownload, callback);
                downloader.on('complete', function(data) {
                    req.app.get('io').sockets.emit(
                        'grab-progress',
                        {
                            progress: data.progress
                        }
                    );
                    console.log('complete action has catched');
                });
                downloader.on('done', function(data) {
                    req.app.get('io').sockets.emit(
                        'grab-progress-complete',
                        data
                    );
                })
            }
        ], function(err, data) {
            if (err) throw err;
            res.end(data);
        });
    }
};
