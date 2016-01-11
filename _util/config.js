require("../_util/polyfill");
var fs = require('fs');

function initConfig() {

  // Read the config from the .json file
  var file_data = fs.readFileSync('./config.json');
  data = JSON.parse(file_data.toString());

  process.argv.forEach(function(val, index, array){
    if(typeof val === "string" && val.startsWith("config=")) {
      var config_param = val.substring(7, val.length);
      console.log(config_param);
      addData(config_param);
    }
  });
}

var addData = function(config_param) {
  var config_add = config_param;
  try {
    if(typeof config_add !== 'object') {
      config_add = JSON.parse(config_add);
    }
  }
  catch(e){
    console.log(e);
    throw ("Invalid argument: Expected the third argument to be configuration data passed as JSON. Got: " + config_param);
  }
  Object.keys(config_add).forEach(function(key){
    data[key] = config_add[key];
  });
}
module.exports.addData = addData;

var data;
if(!data) {
  initConfig();
}
module.exports.data = data;