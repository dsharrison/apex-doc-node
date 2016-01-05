var helper = require('../_util/helper');

var tokens = [
  {
    'name': '@description',
    'type': 'single'
  }
]

// Constructor
function ApexProperty() {
  this.name = '';
}

ApexProperty.prototype.fillDetails = function(file_data_line, commentList, i) {
  this.setNameLine(file_data_line, i);
  this.setName();
  helper.parseTokens(this, tokens, commentList);
}

ApexProperty.prototype.setNameLine = function(name_line_string, line_number) {
  if(name_line_string) {
    var i = name_line_string.indexOf('{');
    if(i == -1) {
      i = name_line_string.indexOf('=');
    }
    if(i == -1) {
      i = name_line_string.indexOf(';');
    }
    if(i >= 0) {
      name_line_string = name_line_string.substring(0, i);
    }
  }
  this.nameLine = name_line_string.trim();
  this.nameLineNumber = line_number;
  this.parseScope();
}

ApexProperty.prototype.setName = function() {
  this.name = '';
  if(this.nameLine && this.nameLine.length > 0) {
    var last_index = this.nameLine.lastIndexOf(' ');
    if(last_index >= 0) {
      this.name = this.nameLine.substring(last_index + 1);
    }
  }
}

ApexProperty.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

module.exports = ApexProperty;