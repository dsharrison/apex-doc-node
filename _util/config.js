var fs = require('fs');

var config;
if(!config) {
  initConfig();
}

function initConfig() {
  var file_data = fs.readFileSync('./config.json');
  config = JSON.parse(file_data.toString());
}

module.exports = config;