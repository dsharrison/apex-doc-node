// Imports
var helper = require('../_util/helper');

// Constructor
function ApexClass(classModelParent) {
  //this.classModelParent = classModelParent;
  if(classModelParent && classModelParent.name) {
    this.parentName = classModelParent.name;
  }
  this.isInterface = false;
  this.childClasses = [];
  this.enums = [];
  this.hasEnums = false;
  this.methods = [];
  this.hasMethods = false;
  this.constructors = [];
  this.hasConstructors = false;
  this.properties = [];
  this.hasProperties = false;
}

var tokens = [{
  'name': '@author',
  'type': 'single'
}, {
  'name': '@date',
  'type': 'single'
}, {
  'name': '@group',
  'type': 'single'
}, {
  'name': '@group-content',
  'type': 'single'
}, {
  'name': '@description',
  'type': 'single'
}]

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

  this.parseName();

  this.parseScope();
}

ApexClass.prototype.parseName = function() {
  var parent_name = '';
  var name_line = this.nameLine;
  if(this.parentName) {
    parent_name = this.parentName + '.';
  }
  if(name_line) {
    var index_f = name_line.toLowerCase().indexOf('class ');
    var offset_f = 6;

    if(index_f == -1) {
      index_f = name_line.toLowerCase().indexOf('interface ');
      offset_f = 10;
    }
    if(index_f >= 0) {
      name_line = name_line.substring(index_f + offset_f).trim();
    }
    var index_l = name_line.indexOf(' ');
    if(index_l == -1) {
      this.name = name_line;
    } else {
      try {
        this.name = name_line.substring(0, index_l);
      } catch(err) {
        this.name = name_line.substring(name_line.lastIndexOf(' ') + 1);
      }
    }
  }
  this.className = this.name;
  this.name = parent_name + this.name;
}

ApexClass.prototype.addChildClass = function(childClass) {
  this.childClasses.push(childClass);
}

ApexClass.prototype.addMethod = function(method) {
  if(method.name == this.className) {
    if(this.parentName) {
      method.name = this.parentName + '.' + method.name;
      method.nameWithParams = this.parentName + '.' + method.nameWithParams;
    }
    this.constructors.push(method);
    this.hasConstructors = true;
  } else {
    this.methods.push(method);
    this.hasMethods = true;
  }
}

ApexClass.prototype.addProperty = function(property) {
  this.properties.push(property);
  this.hasProperties = true;
}

ApexClass.prototype.addEnum = function(e) {
  this.enums.push(e);
  this.hasEnums = true;
}

ApexClass.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Class export
module.exports = ApexClass;
