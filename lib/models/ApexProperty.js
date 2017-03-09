/**
 * The ApexEnum class represents an Enum value in an ApexClass.
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
  'name': '@description',
  'type': 'single'
}];

// Constructors
// =============================================================================

/**
 * @constructor
 * @class
 */
function ApexProperty() {

  // Default values
  this.name = '';
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
ApexProperty.prototype.fillDetails = function(fileDataLine, commentList, lineNumber) {
  this.setNameLine(fileDataLine, lineNumber);
  this.parseScope();
  this.parseName();
  helper.parseTokens(this, tokens, commentList);
}

/**
 * Set the name line of the data line from the source code. The name line contains
 * the full signature from the source code.
 * @param {String}  nameLineString The full data line from the source file.
 * @param {Integer} lineNumber     The line number in the source file.
 */
ApexProperty.prototype.setNameLine = function(nameLineString, lineNumber) {
  if(nameLineString) {
    var i = nameLineString.indexOf('{');
    if(i == -1) {
      i = nameLineString.indexOf('=');
    }
    if(i == -1) {
      i = nameLineString.indexOf(';');
    }
    if(i >= 0) {
      nameLineString = nameLineString.substring(0, i);
    }
  }
  this.nameLine = nameLineString.trim();
  this.nameLineNumber = lineNumber;
  this.parseScope();
}


/**
 * Parse the scope for this property. This will set the scope member variable.
 */
ApexProperty.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

/**
 * Parse the name of the property from the signature line. This will set the
 * name
 */
ApexProperty.prototype.parseName = function() {
  this.name = '';
  var nameLine = this.nameLine;
  if(nameLine) {
    var indexL = nameLine.lastIndexOf(' ');
    if(indexL >= 0) {
      this.name = nameLine.substring(indexL + 1);
    }
  }
}

module.exports = ApexProperty;
