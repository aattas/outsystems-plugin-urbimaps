var fs = require("fs");
var path = require("path");
var et = require('elementtree'); 

function saveFile(filePath, fileContents){
  fs.writeFile(filePath, fileContents, 'utf8', function (err) {
    if (err) 
      {throw new Error('🚨 Unable to write into ' + filePath + ': \n' + err);}
    else 
      {console.log("✅ " + filePath + " saved successfuly");}
  });  
}

function getAppId(context) {
  var config_xml = path.join(context.opts.projectRoot, 'config.xml');
  var data = fs.readFileSync(config_xml).toString();
  var etree = et.parse(data);
  return etree.getroot().attrib.id;
}

function fix_package(filePath, originalImport, correctImport) {
  fs.readFile(filePath, 'utf8', function (err,fileData) {
    if (err) {
      throw new Error('🚨 Unable to read ' + filePath + " :" + err);
    }

    if (fileData.includes(originalImport)){
      var fileContents = fileData.replace(originalImport, correctImport);
      saveFile(filePath, fileContents);

    } else {
      console.log("⚠️ Warning: file " + filePath + "does not contain: " + originalImport);
    }
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

  fix_package(file1Path, originalImport, correctImport);
  fix_package(file2Path, originalImport, correctImport);
  fix_package(file3Path, originalImport, correctImport);
  fix_package(file4Path, originalImport, correctImport);
  fix_package(file5Path, originalImport, correctImport);
  
}