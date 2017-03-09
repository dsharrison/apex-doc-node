// Load other modules
require(getFilePath('/lib/util/polyfill'));
var fs = require('fs');
var parser = require(getFilePath('/lib/parser'));
var fileOutput = require(getFilePath('/lib/output'));
var config = require(getFilePath('/lib/util/config'));

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
  var classesByGroup = {
    totalClasses: 0
  };
  var i = 0;
  var progressMax = files.length / 2;
  files.forEach(function(file_name) {
    if(file_name.endsWith('.cls')) {
      i++;
      var progress = 'Processing Apex [';
      var progressNow = i;
      var progressPercent = ((progressNow / progressMax) * 100).toFixed(1);
      progress += progressNow + '/' + progressMax + ' (' + progressPercent + '%) | ';

      var progressIndicatorTotal = 50;
      var filledIndicators = (progressIndicatorTotal * (progressPercent / 100)).toFixed(0);
      var emptyIndicators = progressIndicatorTotal - filledIndicators;
      for(var x = 0; x < filledIndicators; x++) {
        progress += '=';
      }
      for(var x = 0; x < emptyIndicators; x++) {
        progress += ' ';
      }

      progress += ']';
      fileOutput.printProgressMessage(progress);

      // Read in the file and convert it to an array of strings that will allow
      // us to read line by line of the file.
      var file_data = fs.readFileSync(config.data.source + file_name);
      var classModel = parser.processFile(file_name, file_data);

      if(classModel) {
        classModels.push(classModel);

        if(classModel.group) {
          classesByGroup[classModel.group] = classesByGroup[classModel.group] || [];
          classesByGroup[classModel.group].push(classModel);
        }
        else {
          classesByGroup['Ungrouped'] = classesByGroup['Ungrouped'] || [];
          classesByGroup['Ungrouped'].push(classModel);
        }
        classesByGroup.totalClasses = classesByGroup.totalClasses + 1;
      }
    }
  });

  process.stdout.write('\n');

  //fileOutput.writeResult(classModels);
  fileOutput.writeResult(classesByGroup);
  fileOutput.copyResources();

  console.log('');
  console.log('** Documentation generation complete! **');
  console.log('');
}
module.exports = run;
