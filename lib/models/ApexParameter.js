/**
 * The ApexParameter class represents a constructor or method parameter.
 */

 // Constructors
 // =============================================================================

/**
 * @constructor
 * @class
 * @param {String} lineString The documentation line for this parameter.
 */
function ApexParameter(lineString) {
  var lineStringSplit = lineString.split(/\s+/);
  this.name = lineStringSplit.shift();
  this.description = lineStringSplit.join(' ');
}


// Public methods
// =============================================================================

/**
 * Add a new line to the parameter description. This allows for multi-line
 * comments.
 * @param {String} lineString The documentation line for this parameter.
 */
ApexParameter.prototype.addLine = function(lineString) {
  if(lineString && lineString.length) {
    this.description += ' ' + lineString.trim();
  }
}

// Export this module
module.exports = ApexParameter;
