var helper = require(getFilePath('/lib/util/helper'));

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
    'name': '@example',
    'type': 'single-raw'
  },
  {
    'name': '@param',
    'type': 'array-typed',
    'model': 'ApexParameter'
  },
  {
    'name': '@description',
    'type': 'single'
  }
]

ApexMethod.prototype.fillDetails = function(file_data_line, commentList, i) {
  this.setNameLine(file_data_line, i);
  this.parseName();
  helper.parseTokens(this, tokens, commentList);
  if(this.param) {
    this.hasParams = true;
  }
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

ApexMethod.prototype.parseName = function() {
  this.name = '';
  var name_line = this.nameLine;
  if(name_line) {
    var index_l = name_line.indexOf('(');
    var index_e = name_line.indexOf(')');
    if(index_l >= 0) {
      this.name = helper.getPreviousWord(name_line, index_l);
    }
    this.nameWithParams = this.name;
    this.nameWithParams += name_line.substring(index_l, index_e + 1);
  }
}

ApexMethod.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Class export
module.exports = ApexMethod;