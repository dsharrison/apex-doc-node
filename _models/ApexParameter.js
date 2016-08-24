// Constructor
function ApexParameter(line_string) {
  var line_string_split = line_string.split(/\s+/);
  this.name = line_string_split.shift();
  this.description = line_string_split.join(' ');
}

ApexParameter.prototype.addLine = function(line_string) {
  if(line_string && line_string.length) {
    this.description += ' ' + line_string.trim();
  }
}

// Class export
module.exports = ApexParameter;
