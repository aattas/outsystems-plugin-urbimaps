var fs = require("fs");
var path = require("path");
var xcode = require('xcode');

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
  var projectName = getProjectName();
  projectName = projectName.replace("[","\[");
  projectName = projectName.replace("]","\]");
  projectName = projectName.replace(" ","\ ");
  var destFolderPath = path.join(context.opts.projectRoot, 'platforms/ios/' + projectName + '/SDKKey'); // Update the destination folder name as desired
  
  console.log("⭐️⭐️⭐️ sourceFilePath: " + sourceFilePath);
  console.log("⭐️⭐️⭐️ destFolderPath: " + destFolderPath);

  if (!fs.existsSync(sourceFilePath)) {
    console.error("🚨 dgissdk.key file not found in platforms/ios/www!");
    console.log("⭐️⭐️⭐️ sourceFilePath DOES NOT EXIST!" );
    return;
  } else {
    console.log("⭐️⭐️⭐️ sourceFilePath EXISTS!" );
  }

  if (!fs.existsSync(destFolderPath)) {
    console.log("⭐️⭐️⭐️ destFolderPath o path NAO existe!" );
    fs.mkdirSync(destFolderPath);
  } else {
    console.log("⭐️⭐️⭐️ destFolderPath o path existe!" );
  }

  fs.copyFileSync(sourceFilePath, path.join(destFolderPath, 'dgissdk.key'));

  var pbxProjPath = path.join(context.opts.projectRoot, 'platforms/ios/' + projectName + '.xcodeproj/project.pbxproj'); // Update with the actual Xcode project name

  var project = xcode.project(pbxProjPath);
  project.parseSync();

  var classesKey = project.findPBXGroupKey({ name: 'CustomTemplate' });

  var group = project.pbxCreateGroup('SDKKey', projectName, '/SDKKey'); // Update 'groupName' and 'projectName' with the desired names

  project.addToPbxGroup(group, classesKey);
  project.addResourceFile('SDKKey/dgissdk.key', null, group); // Assuming 'dgissdk.key' is a resource file, change accordingly if it's a source file

  fs.writeFileSync(pbxProjPath, project.writeSync());
  console.log('⭐️ Project written');
};
