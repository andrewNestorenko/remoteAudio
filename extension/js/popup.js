$(function () {
    var muteSwitch = $('#mute-switch');
    chrome.storage.local.get('localMute', function (result) {
        muteSwitch.bootstrapSwitch('setState', result.localMute);
    });
    muteSwitch.on('switch-change', function (e, data) {
        var $el = $(data.el)
            , value = data.value;
        chrome.storage.local.set({'localMute': !!value})
    });
    var enabledSwitch = $('#enabled-switch');
    chrome.storage.local.get('enabled', function (result) {
        enabledSwitch.bootstrapSwitch('setState', result.enabled);
    });
    enabledSwitch.on('switch-change', function (e, data) {
        var $el = $(data.el)
            , value = data.value;
        chrome.storage.local.set({'enabled': !!value})
    });

    chrome.storage.local.get('volumeMultiplier', function (result) {
        $('#range').val(result.volumeMultiplier);
    });
    $('#range').on('change', function (e) {
        chrome.storage.local.set({'volumeMultiplier': $(e.currentTarget).val()});
    });

});