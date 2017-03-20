var exec = require('child_process').exec;
var async = require('async');
var replace = require("replace");

var FILE_NAMES_WITH_TEMPLATE_VARIABLES = [
  "package.json",
  "main.js"
];

var TEMPLATE_VARIABLE = "{package_name}";

module.exports = {
  generateSimplePackage: function(directoryPath, cb) {
    var packageNameParts = directoryPath.split("/");
    var packageName = packageNameParts[packageNameParts.length - 1];
    var templateFolderPath = __dirname + "/basic-package/*";
    var mkdirCmd = "mkdir {packagePath}".replace("{packagePath}", directoryPath);
    var cpCmd = "cp -R {templateFolderPath} {packagePath}/".
      replace("{templateFolderPath}", templateFolderPath).
      replace("{packagePath}", directoryPath);
    var apmLinkCmd = "apm link {packagePath}".
      replace("{packagePath}", directoryPath);
      var results = [];

    async.waterfall([
      function _makeDirectory(next) {
        return runCmd(mkdirCmd, next);
      },
      function _copyTemplate(res, next) {
        results.push(res);
        return runCmd(cpCmd, next);
      },
    function _replaceTemplateVariables(res, next) {
        replace({
            regex: TEMPLATE_VARIABLE,
            replacement: packageName,
            paths: getFilesWithTemplateVariables(directoryPath),
            recursive: true,
            silent: true,
        });
        return next(null, null);
      },
    function _runApmLink(res, next) {
        results.push(res);
        return runCmd(apmLinkCmd, next);
    }],
    function _handleRes(err, res){
        results.push(res);
        if(err) {
          return cb(err);
        } else {
          return cb(null, results);
        }
    });
  }
};

function getFilesWithTemplateVariables(packagePath) {
    var files = [];
    FILE_NAMES_WITH_TEMPLATE_VARIABLES.forEach(
      function(fileName) {
        files.push(packagePath + "/" + fileName);
      }
    );
    return files;
}

function runCmd(cmd, cb) {
  return exec(cmd, function (error, stdout, stderr) {
    if (error) {
      return cb(error);
    } else {
      return cb(null, stdout);
    }
  });
}
