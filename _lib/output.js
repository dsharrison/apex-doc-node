var fs = require('fs');

var writeResult = function(classModels) {
  fs.writeFile('result.json', JSON.stringify(classModels), function(err) {
    if(err) {
      throw err;
    }
    else {
      console.log('**************************************************************************');
      console.log('* Complete! Results written to result.json');
      console.log('**************************************************************************');
    }
  });
}
module.exports.writeResult = writeResult;