var fs = require("fs");
var path = require("path");

function getProjectName() {
    var config = fs.readFileSync('config.xml').toString();
    var parseString = require('xml2js').parseString;
    var name;
    parseString(config, function (err, result) {
        name = result.widget.name.toString();
        const r = /\B\s+|\s+\B/g;  //Removes trailing and leading spaces
        name = name.replace(r, '');
    });
    return name || null;
}

module.exports = function(context) {
  var sourceFilePath = path.join(context.opts.projectRoot, 'platforms/ios/www/SDKKey/dgissdk.key');
  var destFilePath = path.join(context.opts.projectRoot, 'plugins/outsystems-plugin-urbimaps/src/dgissdk.key'); // Update the destination folder name as desired
  
  console.log("⭐️⭐️⭐️ sourceFilePath: " + sourceFilePath);
  console.log("⭐️⭐️⭐️ destFolderPath: " + destFilePath);

  if (!fs.existsSync(sourceFilePath)) {
    console.error("🚨 dgissdk.key file not found in platforms/ios/www!");
    console.log("⭐️⭐️⭐️ sourceFilePath DOES NOT EXIST!" );
    return;
  } else {
    console.log("⭐️⭐️⭐️ sourceFilePath EXISTS!" );
  }

  fs.copyFileSync(sourceFilePath, destFilePath);

  
  console.log('⭐️ SDKKey copied!');
};
