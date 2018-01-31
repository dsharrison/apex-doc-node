/**
 * The ApexClass model represents an Apex Class file.
 * @module lib/models/ApexClass
 */

// Imports
// =============================================================================

/**
 * Helper utilities shared between models.
 * @type {Class}
 */
var helper = require(getFilePath('/lib/util/helper'));


// Private member variables
// =============================================================================

/**
 * Define the tokens that the parser will look for in this model.
 * @type {Array}
 */
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
}];


// Constructors
// =============================================================================

/**
 * @class
 * @constructor
 * @param {ApexClass} classModelParent The parent class if this is an inner class.
 */
function ApexClass(classModelParent) {

  if(classModelParent && classModelParent.name) {
    this.parentName = classModelParent.name;
  }

  // Default properties
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
  this.group = 'Ungrouped';
}


// Public methods
// =============================================================================

/**
 * Populate details of this Apex class from a documented property in the source
 * file.
 * @param  {String}  fileDataLine   The single line from the file the parser is
 *                                  currently working with.
 * @param  {Array}   commentList    The array of comment lines documenting the
 *                                  current data line.
 * @param  {Integer} lineNumber     The line number of the current fileDataLine
 *                                  in the source file.
 */
ApexClass.prototype.fillDetails = function(fileDataLine, commentList, lineNumber) {
  this.setNameLine(fileDataLine, lineNumber);
  if(fileDataLine.toLowerCase().includes(' interface ')) {
    this.isInterface = true;
  }

  // Use the helper to parse the tokens for the comment array
  helper.parseTokens(this, tokens, commentList);
}

/**
 * Set the name line of the data line from the source code. The name line contains
 * the full signature from the source code.
 * @param {String}  nameLineString The full data line from the source file.
 * @param {Integer} lineNumber     The line number in the source file.
 */
ApexClass.prototype.setNameLine = function(nameLineString, lineNumber) {
  this.nameLine = nameLineString.trim();
  this.nameLineNumber = lineNumber;
  this.parseName();
  this.parseScope();
}

/**
 * Parse the name of the class from the signature line.
 */
ApexClass.prototype.parseName = function() {
  var parentName = '';
  var nameLine = this.nameLine;
  if(this.parentName) {
    parentName = this.parentName + '.';
  }
  if(nameLine) {
    var indexF = nameLine.toLowerCase().indexOf('class ');
    var offsetF = 6;

    if(indexF == -1) {
      indexF = nameLine.toLowerCase().indexOf('interface ');
      offsetF = 10;
    }
    if(indexF >= 0) {
      nameLine = nameLine.substring(indexF + offsetF).trim();
    }
    var indexL = nameLine.indexOf(' ');
    if(indexL == -1) {
      this.name = nameLine;
    }
    else {
      try {
        this.name = nameLine.substring(0, indexL);
      }
      catch(err) {
        this.name = nameLine.substring(nameLine.lastIndexOf(' ') + 1);
      }
    }
  }
  this.className = this.name;
  this.name = parentName + this.name;
}

/**
 * Add an inner class doc to this class.
 * @param {ApexClass} childClass The inner class to add to the documentation.
 */
ApexClass.prototype.addChildClass = function(childClass) {
  this.childClasses.push(childClass);
}

/**
 * Add a method doc to this class.
 * @param {ApexMethod} method The ApexMethod to add to this class.
 */
ApexClass.prototype.addMethod = function(method) {
  if(method.name == this.className) {
    if(this.parentName) {
      method.name = this.parentName + '.' + method.name;
      method.nameWithParams = this.parentName + '.' + method.nameWithParams;
    }
    this.constructors.push(method);
    this.hasConstructors = true;
  }
  else {
    this.methods.push(method);
    this.hasMethods = true;
  }
}

/**
 * Add a property doc to this class.
 * @param {ApexProperty} property The ApexProperty to add to this class.
 */
ApexClass.prototype.addProperty = function(property) {
  this.properties.push(property);
  this.hasProperties = true;
}

/**
 * Add an enum doc to this class.
 * @param {ApexEnum} e The ApexEnum to add to this class.
 */
ApexClass.prototype.addEnum = function(e) {
  this.enums.push(e);
  this.hasEnums = true;
}

/**
 * Parse the scope for this class. This will set the scope member variable.
 */
ApexClass.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Export our module
module.exports = ApexClass;
