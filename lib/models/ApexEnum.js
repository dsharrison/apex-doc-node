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
 * @class
 * @constructor
 * @param {ApexClass} classModelParent The parent class if this is an inner class.
 */
function ApexEnum(classModelParent) {
  if(classModelParent && classModelParent.name) {
    this.parentName = classModelParent.name;
  }

  // Default properties
  this.values = [];
  this.hasValues = false;
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
ApexEnum.prototype.fillDetails = function(fileDataLine, commentList, lineNumber) {
  this.setNameLine(fileDataLine, lineNumber);
  if(fileDataLine.toLowerCase().includes(' interface ')) {
    this.isInterface = true;
  }

  helper.parseTokens(this, tokens, commentList);
}

/**
 * Set the name line of the data line from the source code. The name line contains
 * the full signature from the source code.
 * @param {String}  nameLineString The full data line from the source file.
 * @param {Integer} lineNumber     The line number in the source file.
 */
ApexEnum.prototype.setNameLine = function(nameLineString, lineNumber) {
  this.nameLine = nameLineString.trim();
  this.nameLineNumber = lineNumber;
  this.parseScope();
  this.parseName();
}

/**
 * Parse the name of the enum from the signature line.
 */
ApexEnum.prototype.parseName = function() {
  var parentName = '';
  var nameLine = this.nameLine;
  nameLine = nameLine.replace(this.scope, '').replace('enum', '').trim();
  if(this.parentName) {
    parentName = this.parentName + '.';
  }
  if(nameLine) {
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
 * Add a value to the enum.
 * @param {String} val The enum value to add to the list.
 */
ApexEnum.prototype.addValue = function(val) {
  val = val.replace(',', '');
  val = val.trim();
  if(val && val.length) {
    this.values.push(val);
    this.hasValues = true;
  }
}

/**
 * Parse the scope for this enum. This will set the scope member variable.
 */
ApexEnum.prototype.parseScope = function() {
  this.scope = null;
  if(this.nameLine != null) {
    this.scope = helper.getScopeFromString(this.nameLine);
  }
}

// Export this module
module.exports = ApexEnum;
