var fs = require('fs'),
    async = require('async'),
    https = require('https'),
    http = require('http'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

function Downloader(basepath) {
    this.basepath = basepath;
    EventEmitter.call(this);
    return this;

}
util.inherits(Downloader, EventEmitter);
Downloader.prototype.download = function(data, callback) {
    var that = this,
        length = data.length,
        done = 0,
        skipped = 0;
    async.eachLimit(
        data,
        5,
        function(item, cb) {
            var path = require('path').join(that.basepath, item.fileName);
            fs.stat(that.basepath, function(err, info) {
                if (err) fs.mkdir(that.basepath, function(err) {
                    if (err) cb(err);
                });
                var file = fs.createWriteStream(path, {flags: 'w'});
                http.get(item.url, function(response) {
                    response.pipe(file);
                    response.on('end', function() {
                        file.close();
                        that.emit('complete', {progress: parseInt((done + skipped) / length * 100, 10)});
                        done++;
                        cb(null);
                    });
                }).on('error', function(err) {
                    skipped++;
                    that.emit('skipped', path);
                });
                file.on('error', function(err) {
                    skipped++;
                    that.emit('skipped', path);
                });

            });
        },
        function(err) {
            if (err) callback(err);
            callback(null, 'All data has been downloaded!');
            that.emit('done', {downloaded: done, skipped: skipped});
        }
    )
};
module.exports = Downloader;