// Set a global variable for our app root
var path = require('path');
global.appRoot = path.resolve(__dirname);
global.getFilePath = function(local_path) {
  return appRoot + local_path;
}
module.exports = {
  config: require(getFilePath('/lib/util/config')),
  run: require(getFilePath('/lib/main'))
}
