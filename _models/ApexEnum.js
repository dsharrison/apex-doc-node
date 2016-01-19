// Imports
var helper = require('../_util/helper');

var tokens = [
  {
    'name': '@description',
    'type': 'single'
  }
]

// Constructor
function ApexEnum(classModelParent) {
  //this.classModelParent = classModelParent;
  if(classModelParent && classModelParent.name) {
    this.parentName = classModelParent.name;
  }
  this.values = [];
  this.hasValues = false;
}

// Enum methods
ApexEnum.prototype.fillDetails = function(file_data_line, commentList, i) {
  this.setNameLine(file_data_line, i);
  if(file_data_line.toLowerCase().includes(' interface ')) {
    this.isInterface = true;
  }

  helper.parseTokens(this, tokens, commentList);
}

ApexEnum.prototype.setNameLine = function(name_line_string, line_number) {
  this.nameLine = name_line_string.trim();
  this.nameLineNumber = line_number;
  this.parseScope();
  this.parseName();
}

ApexEnum.prototype.parseName = function() {
  var parent_name = '';
  var name_line = this.nameLine;
  name_line = name_line.replace(this.scope, '').replace('enum', '').trim();
  if(this.parentName) {
    parent_name = this.parentName + '.';
  }
  if(name_line) {
    var index_l = name_line.indexOf(' ');
    console.log('Index L: ' + index_l);
    if(index_l == -1) {
      this.name = name_line;
    }
    else {
      try {
        this.name = name_line.substring(0, index_l);
      }
      catch(err) {
        this.name = name_line.substring(name_line.lastIndexOf(' ') + 1);
      }
    }
  }
  this.className = this.name;
  this.name = parent_name + this.name;
}

ApexEnum.prototype.addValue = function(val) {
  val = val.replace(',', '');
  val = val.trim();
  if(val && val.length) {
    this.values.push(val);
    this.hasValues = true;
  }
}

ApexEnum.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Class export
module.exports = ApexEnum;