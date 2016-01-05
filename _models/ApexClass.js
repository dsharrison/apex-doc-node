// Imports
var config = require('../_util/config');
var helper = require('../_util/helper');

// Constructor
function ApexClass(classModelParent) {
  //this.classModelParent = classModelParent;
  this.isInterface = false;
  this.childClasses = [];
  this.methods = [];
  this.properties = [];
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
    'name': '@group',
    'type': 'single'
  },
  {
    'name': '@group-content',
    'type': 'single'
  },
  {
    'name': '@description',
    'type': 'single'
  }
]

// Class methods
ApexClass.prototype.fillDetails = function(file_data_line, commentList, i) {
  this.setNameLine(file_data_line, i);
  if(file_data_line.toLowerCase().includes(' interface ')) {
    this.isInterface = true;
  }

  helper.parseTokens(this, tokens, commentList);
}

ApexClass.prototype.setNameLine = function(name_line_string, line_number) {
  this.nameLine = name_line_string.trim();
  this.nameLineNumber = line_number;
  this.parseScope();
}

ApexClass.prototype.addChildClass = function(childClass) {
  this.childClasses.push(childClass);
}

ApexClass.prototype.addMethod = function(method) {
  this.methods.push(method);
}

ApexClass.prototype.addProperty = function(property) {
  this.properties.push(property);
}

ApexClass.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Class export
module.exports = ApexClass;