// Set a global variable for our app root
var path = require('path');
global.appRoot = path.resolve(__dirname);
console.log('ApexDoc Root: ' + appRoot);
global.getFilePath = function(local_path){
  return appRoot + local_path;
}
module.exports = {
  config : require(getFilePath('/_util/config')),
  run : require(getFilePath('/main'))
}