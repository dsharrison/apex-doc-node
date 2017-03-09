/**
 * The Apexmethod class represents a method in an ApexClass.
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
  'name': '@return',
  'type': 'single'
}, {
  'name': '@example',
  'type': 'single-raw'
}, {
  'name': '@param',
  'type': 'array-typed',
  'model': 'ApexParameter'
}, {
  'name': '@description',
  'type': 'single'
}];


// Constructors
// =============================================================================

/**
 * @class
 * @constructor
 */
function ApexMethod() {

}

// Public methods
// =============================================================================

/**
 * Populate details of this Apex enum from a documented property in the source
 * file.
 * @param  {String}  fileDataLine   The single line from the file the parser is
 *                                  currently working with.
 * @param  {Array}   commentList    The array of comment lines documenting the
 *                                  current data line.
 * @param  {Integer} lineNumber     The line number of the current fileDataLine
 *                                  in the source file.
 */
ApexMethod.prototype.fillDetails = function(fileDataLine, commentList, lineNumber) {
  this.setNameLine(fileDataLine, lineNumber);
  this.parseName();
  helper.parseTokens(this, tokens, commentList);
  if(this.param) {
    this.hasParams = true;
  }
}

/**
 * Set the name line of the data line from the source code. The name line contains
 * the full signature from the source code.
 * @param {String}  nameLineString The full data line from the source file.
 * @param {Integer} lineNumber     The line number in the source file.
 */
ApexMethod.prototype.setNameLine = function(nameLineString, lineNumber) {
  if(nameLineString) {
    var i = nameLineString.lastIndexOf(')');
    if(i >= 0) {
      nameLineString = nameLineString.substring(0, i + 1);
    }
  }
  this.nameLine = nameLineString.trim();
  this.nameLineNumber = lineNumber;
  this.parseScope();
}

/**
 * Parse the name of the method from the signature line.
 */
ApexMethod.prototype.parseName = function() {
  this.name = '';
  var nameLine = this.nameLine;
  if(nameLine) {
    var indexL = nameLine.indexOf('(');
    var indexE = nameLine.indexOf(')');
    if(indexL >= 0) {
      this.name = helper.getPreviousWord(nameLine, indexL);
    }
    this.nameWithParams = this.name;
    this.nameWithParams += nameLine.substring(indexL, indexE + 1);
  }
}

/**
 * Parse the scope for this method. This will set the scope member variable.
 */
ApexMethod.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Export this module
module.exports = ApexMethod;
