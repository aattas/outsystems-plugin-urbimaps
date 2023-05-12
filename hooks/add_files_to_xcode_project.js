var fs = require("fs");
var path = require("path");
var xcode = require('xcode');
var fse = require('fs-extra');

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
  var projectName = getProjectName();

  var sourceFolderPath = path.join(context.opts.projectRoot, 'plugins/outsystems-plugin-urbimaps/src/ios/SDKClasses');
  console.log("⭐️⭐️⭐️ >>>sourceFolderPath: " + sourceFolderPath);
  
  var destFolderPath = path.join(context.opts.projectRoot, 'platforms/ios/' + projectName + '/SDKClasses'); // Update the destination folder name as desired
  
  if (!fs.existsSync(sourceFolderPath)) {
    console.error("🚨 SDKClasses folder not found!");
    return;
  }

  if (!fs.existsSync(destFolderPath)) {
    fs.mkdirSync(destFolderPath);
  }

  
  try {
  fse.copySync(sourceFolderPath, destFolderPath, { overwrite: true })
    console.log('⭐️⭐️⭐️ >>> folder copy was successful! <<< ⭐️⭐️⭐️')
  } catch (err) {
    console.error("🚨🚨🚨 >>> Error copying sources folder <<< 🚨🚨🚨")
  }


  var pbxProjPath = path.join(context.opts.projectRoot, 'platforms/ios/' + projectName + '.xcodeproj/project.pbxproj'); // Update with the actual Xcode project name

  var project = xcode.project(pbxProjPath);
  project.parseSync();

  var classesKey = project.findPBXGroupKey({ name: 'CustomTemplate' });

  var group = project.pbxCreateGroup('SDKClasses', projectName, '/SDKClasses'); // Update 'groupName' and 'projectName' with the desired names


  //ITERAR AQUI E ADD TUDO!
  project.addToPbxGroup(group, classesKey);
  project.addResourceFile('SDKKey/dgissdk.key', null, group); // Assuming 'dgissdk.key' is a resource file, change accordingly if it's a source file

  fs.writeFileSync(pbxProjPath, project.writeSync());
  console.log('⭐️ Project written');
};
