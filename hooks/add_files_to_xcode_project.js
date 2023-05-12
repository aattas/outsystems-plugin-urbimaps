var fs = require("fs");
var path = require("path");
var utils = require("./utilities");
var defer = require("q").defer();
var xcode = require('xcode');
var ncp = require('ncp').ncp;
var constants = {
  sdkKeyFile: "dgissdk.key",
  sdkClasses: "SDKClasses"
};

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
  var platform = context.opts.plugin.platform;
  var platformConfig = utils.getPlatformConfigs(platform);
  if (!platformConfig) {
    utils.handleError("Invalid platform", defer);
  }

  var sourceFolderPath = path.join(context.opts.projectRoot, 'plugins/outsystems-plugin-urbimaps/src/ios/sdkClasses');
  console.log("⭐️⭐️⭐️ >>>sourceFolderPath: " + sourceFolderPath);
  var destFolderPath = path.join(context.opts.projectRoot, 'platforms/ios/groupName'); // Update the destination folder name as desired

  if (!fs.existsSync(sourceFolderPath)) {
    utils.handleError("🚨 SDK folder not found in resources!", defer);
  }

  // Create the destination folder
  if (!fs.existsSync(destFolderPath)) {
    fs.mkdirSync(destFolderPath);
  }

  // Copy the entire folder to the destination
  ncp(sourceFolderPath, destFolderPath, function (err) {
    if (err) {
      utils.handleError("🚨 Error copying SDK folder: " + err, defer);
    } else {
      console.log("⭐️ SDK Folder copied successfully to: " + destFolderPath);
      continueXcodeSetup();
    }
  });

  function continueXcodeSetup() {
    var projectName = getProjectName();
    var pbxProjPath = path.join(context.opts.projectRoot, 'platforms/ios/' + projectName + ".xcodeproj/project.pbxproj");
    var projPath = path.join(context.opts.projectRoot, 'platforms/ios/' + projectName);

    var project = xcode.project(pbxProjPath);
    project.parseSync();

    var classesKey = project.findPBXGroupKey({ name: 'CustomTemplate' }); 

    // Create a group in the Xcode project
    var groupName = 'groupName'; // Update with the desired group name
    var group = project.pbxCreateGroup(groupName, 'projectName/' + groupName);
    project.addToPbxGroup(group, classesKey);

    // Iterate through the files in the destination folder and add them to the Xcode project
    var files = fs.readdirSync(destFolderPath);
    files.forEach(function(file) {
      var filePath = path.join(groupName, file);
      if (file.indexOf(".h") >= 0) {
        project.addHeaderFile(filePath, null, group);
      } else {
        project.addSourceFile(filePath, null, group);
      }
    });

    fs.writeFileSync(pbxProjPath, project.writeSync());
    console.log('⭐️ Project written');

    defer.resolve(); // Resolve the promise to indicate the completion of the hook
  }

  return defer.promise;
}
