var helper = require('../_util/helper');

// Constructor
function ApexMethod() {

}

var tokens = [
  {
    'name': '@author',
    'type': 'single'
  },
  {
    'name': '@date',
    'type': 'single'
  },
  {
    'name': '@return',
    'type': 'single'
  },
  {
    'name': '@param',
    'type': 'array'
  },
  {
    'name': '@description',
    'type': 'single'
  }
]

ApexMethod.prototype.fillDetails = function(file_data_line, commentList, i) {
  this.setNameLine(file_data_line, i);
  helper.parseTokens(this, tokens, commentList);
}

ApexMethod.prototype.setNameLine = function(name_line_string, line_number) {
  if(name_line_string) {
    var i = name_line_string.lastIndexOf(')');
    if(i >= 0) {
      name_line_string = name_line_string.substring(0, i + 1);
    }
  }
  this.nameLine = name_line_string.trim();
  this.nameLineNumber = line_number;
  this.parseScope();
}

ApexMethod.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Class export
module.exports = ApexMethod;