var exec = require('cordova/exec');

exports.openMap = function (success, error) {
    exec(success, error, 'UrbiMaps', 'openMap');
};

exports.openMapWithFinishPoint = function (lat, lon, objId, success, error) {
    exec(success, error, 'UrbiMaps', 'openMapWithFinishPoint',[lat, lon, objId]);
};