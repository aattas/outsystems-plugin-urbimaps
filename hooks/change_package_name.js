var fs = require("fs");
var path = require("path");
var et = require('elementtree'); 

function saveFile(filePath, fileContents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContents, 'utf8', function (err) {
      if (err) {
        reject(new Error('🚨 Unable to write into ' + filePath + ': \n' + err));
      } else {
        console.log("✅ " + filePath + " saved successfully");
        resolve();
      }
    });
  });
}

function getAppId(context) {
  var config_xml = path.join(context.opts.projectRoot, 'config.xml');
  var data = fs.readFileSync(config_xml).toString();
  var etree = et.parse(data);
  return etree.getroot().attrib.id;
}

function fix_package(filePath, originalImport, correctImport) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', function (err, fileData) {
      if (err) {
        reject(new Error('🚨 Unable to read ' + filePath + " :" + err));
      } else {
        if (fileData.includes(originalImport)) {
          var fileContents = fileData.replace(new RegExp(originalImport, 'g'), correctImport);
          saveFile(filePath, fileContents)
            .then(resolve)
            .catch(reject);
        } else {
          console.log("⚠️ Warning: file " + filePath + " does not contain: " + originalImport);
          resolve();
        }
      }
    });
  });
}

module.exports = function(context) {
  const appId = getAppId(context);
  const originalImport = "import com.outsystems.experts.neom.R";
  const correctImport = "import " + appId + ".R";
  var basePath = path.join(context.opts.projectRoot, '/plugins/outsystems-plugin-urbimaps/src/android/');
  var file1Path = path.join(basePath, '/SearchActivity.kt');
  var file2Path = path.join(basePath, '/AdapterSearch.kt');
  var file3Path = path.join(basePath, '/MainMapsActivity.kt');
  var file4Path = path.join(basePath, '/MapsGisFullActivity.kt');
  var file5Path = path.join(basePath, '/NavigationViewModel.kt');

  var promises = [
    fix_package(file1Path, originalImport, correctImport),
    fix_package(file2Path, originalImport, correctImport),
    fix_package(file3Path, originalImport, correctImport),
    fix_package(file4Path, originalImport, correctImport),
    fix_package(file5Path, originalImport, correctImport)
  ];

  return Promise.all(promises);
};
