// Load other modules
require(getFilePath('/_util/polyfill'));
var fs = require('fs');
var parser = require(getFilePath('/_lib/parser'));
var fileOutput = require(getFilePath('/_lib/output'));
var config = require(getFilePath('/_util/config'));

var run = function() {
  var scopes = '"' + config.data.scopes.join('", "') + '"';
  fileOutput.printStatusMessage('Running ApexDoc for files in ' + config.data.source + ' and scope(s): ' + scopes);

  var files;
  try {
    files = fs.readdirSync(config.data.source);
  }
  catch(err) {
    throw err;
  }

  var classModels = [];
  var i = 0;
  files.forEach(function(file_name){
    if(file_name.endsWith('.cls')) {
      i++;
      console.log('* Processing ' + i + ' of ' + (files.length / 2) + ': ' + file_name);

      // Read in the file and convert it to an array of strings that will allow
      // us to read line by line of the file.
      var file_data = fs.readFileSync(config.data.source + file_name);
      var classModel = parser.processFile(file_name, file_data);

      if(classModel) {
        classModels.push(classModel);
      }
    }
  });

  fileOutput.writeResult(classModels);
  fileOutput.copyResources();

  console.log('');
  console.log('** Documentation generation complete! **');
  console.log('');
}
module.exports = run;