// Load other modules
require('./_util/polyfill');
var fs = require('fs');
var parser = require('./_lib/parser');
var fileOutput = require('./_lib/output');
var config = require('./_util/config');

var scopes = '"' + config.scopes.join('", "') + '"';
console.log('**************************************************************************');
console.log('* Running ApexDoc for files in ' + config.directory);
console.log('* and scope(s): ' + scopes);
console.log('**************************************************************************');

fs.readdir(config.directory, function(err, files){
  if(err) {
    throw err;
  }

  var classModels = [];

  var i = 0;
  files.forEach(function(file_name){
    if(file_name.endsWith('.cls')) {
      i++;
      console.log('Processing ' + i + ' of ' + (files.length / 2) + ': ' + file_name);

      // Read in the file and convert it to an array of strings that will allow
      // us to read line by line of the file.
      var file_data = fs.readFileSync(config.directory + file_name);
      var classModel = parser.processFile(file_name, file_data);

      if(classModel) {
        classModels.push(classModel);
      }
    }
  });

  fileOutput.writeResult(classModels);
});