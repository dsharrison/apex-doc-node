// Set a global variable for our app root
global.appRoot = require('app-root-path');
global.getFilePath = function(local_file) {
  return appRoot + local_file;
}
module.exports = {
  config : require(getFilePath('/_util/config')),
  run : require(getFilePath('/main'))
}