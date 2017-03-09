var helper = require(getFilePath('/lib/util/helper'));

var tokens = [{
  'name': '@description',
  'type': 'single'
}]

// Constructor
function ApexProperty() {
  this.name = '';
}

ApexProperty.prototype.fillDetails = function(file_data_line, commentList, i) {
  this.setNameLine(file_data_line, i);
  this.setName();
  this.parseScope();
  this.parseName();
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

ApexProperty.prototype.parseName = function() {
  this.name = '';
  var name_line = this.nameLine;
  if(name_line) {
    var index_l = name_line.lastIndexOf(' ');
    if(index_l >= 0) {
      this.name = name_line.substring(index_l + 1);
    }
  }
}

module.exports = ApexProperty;
