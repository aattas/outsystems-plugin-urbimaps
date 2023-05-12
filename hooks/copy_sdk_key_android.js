var fs = require("fs");
var path = require("path");
var utils = require("./utilities");
var defer = require("q").defer();
var constants = {
  sdkKeyFile: "dgissdk.key"
};

module.exports = function(context) {
  
  var platform = context.opts.plugin.platform;
  var platformConfig = utils.getPlatformConfigs(platform);
  if (!platformConfig) {
    utils.handleError("Invalid platform", defer);
  }

  //platforms/android/app/src/main/assets

  var sourceFilePath = path.join(context.opts.projectRoot, '/platforms/android/app/src/main/assets/www/SDKKey/' + constants.sdkKeyFile);
  console.log("⭐️ sourceFilePath: " + sourceFilePath);
  var destFilePath = path.join(context.opts.projectRoot, 'platforms/android/app/src/main/assets/' + constants.sdkKeyFile);
  console.log("⭐️ destFilePath: " + destFilePath);

  if (fs.existsSync(sourceFilePath)) {
    utils.copyFromSourceToDestPath(defer, sourceFilePath, destFilePath);  
    fs.copyFile(sourceFilePath, destFilePath, (err) => {
      if (err) {console.log("🚨 Error copying sdk key"); throw err; }
      console.log("⭐️ SDK File copied successfuly to: " + destFilePath);
    });
  } else {
    utils.handleError("🚨 No source file (sdk key) found from resources", defer);
  }

  return defer.promise;
}