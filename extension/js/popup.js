$(function() {
    var muteSwitch = $('#mute-switch');
    chrome.storage.local.get('localMute', function(result) {
        muteSwitch.bootstrapSwitch('setState', result.localMute);
    });
    muteSwitch.on('switch-change', function (e, data) {
        var $el = $(data.el)
            , value = data.value;
        chrome.storage.local.set({'localMute': !!value})
    });


    var enabledSwitch = $('#enabled-switch');

    chrome.storage.local.get('enabled', function(result) {
        enabledSwitch.bootstrapSwitch('setState', result.enabled);
    });
    enabledSwitch.on('switch-change', function (e, data) {
        var $el = $(data.el)
            , value = data.value;
        chrome.storage.local.set({'enabled': !!value})
    });
});