var async = require('async');
var https = require('https');
module.exports = {
    get: function(req, res) {
        async.waterfall([
            function(callback) {
                https.get('https://api.vk.com/method/audio.get?access_token=' + req.user.accessToken,function(resp) {
                    var mainBuffer = '';
                    resp.on('data',function(data) {
                        mainBuffer += data;
                    }).on('end', function() {
                         try {
                             var data = JSON.parse(mainBuffer);
                             callback(null, data);
                         } catch (e) {
                             callback(e);
                         }

                    });
                }).on('error', function(err) {
                    callback(err);
                });
            }

        ], function(err, data) {
            if (err) throw err;
            res.render('user/audio', {
                data: data.response
            })
        });
//        res.render('user/profile');
    }
}