var helper = require('../_util/helper');
var config = require('../_util/config');

var ApexClassModel = require('../_models/ApexClass');
var ApexMethodModel = require('../_models/ApexMethod');
var ApexPropertyModel = require('../_models/ApexProperty');

var processFile = function(file_name, file_data) {

  // Split file data to array of strings for processing
  var file_data_string = file_data.toString();
  var file_data_array = file_data_string.split('\n');

  // Set up our tracking variables
  var commentStarted = false;
  var docBlockStarted = false;
  var nestedBraceDepth = 0;
  var commentList = [];

  // Set up out models
  var classModel = null;
  var classModelParent = null;
  var classModelStack = [];

  // Loop over each line in the file
  for(var i = 0; i < file_data_array.length; i++) {
    var file_data_line = file_data_array[i];

    // If we have no data, move to the next line
    if(file_data_line.length == 0) {
      continue;
    }
    file_data_line = file_data_line.trim();
    file_data_line = helper.trimForComments(file_data_line);

    if(file_data_line.startsWith('/*')) {
      commentStarted = true;
      var commentEnded = false;
      if(file_data_line.startsWith('/**')) {
        if(file_data_line.endsWith('/*')) {
          file_data_line = file_data_line.replace('*/', '');
          commentEnded = true;
        }
        commentList.push(file_data_line);
        docBlockStarted = true;
      }
      if(file_data_line.endsWith('*/') || commentEnded) {
        commentStarted = false;
        docBlockStarted = false;
      }
      continue;
    }

    if(commentStarted && file_data_line.endsWith('*/')) {
      file_data_line = file_data_line.replace('/*', '');
      if(docBlockStarted) {
        commentList.push(file_data_line);
        docBlockStarted = false;
      }
      commentStarted = false;
      continue;
    }

    if(commentStarted) {
      if(docBlockStarted) {
        commentList.push(file_data_line);
      }
      continue;
    }

    // keep track of our nesting so we can track our class
    var openBraceCount = helper.countStringMatches('{', file_data_line);
    var closeBraceCount = helper.countStringMatches('}', file_data_line);
    nestedBraceDepth += openBraceCount;
    nestedBraceDepth -= closeBraceCount;

    // if we are in a nested class, and we just got back to nesting level 1,
    // then we are done with the nested class, and should set its props and methods.
    if(nestedBraceDepth == 1 && openBraceCount != closeBraceCount && classModelStack.length > 1 && classModel != null) {
      classModelStack.pop();
      classModel = classModelStack.peek();
    }

    // Ignore anything after assignment
    var ich = file_data_line.indexOf('=');
    if(ich > -1) {
      file_data_line = file_data_line.substring(0, ich);
    }

    // ignore anything after {
    ich = file_data_line.indexOf('{');
    if(ich > -1) {
      file_data_line = file_data_line.substring(0, ich);
    }

    //ignore lines not dealing with scope but do not skip interfaces
    if(!helper.getScopeFromString(file_data_line) && !(classModel != null && classModel.isInterface && file_data_line.includes('('))) {
      continue;
    }

    // look for a class
    if(file_data_line.toLowerCase().includes(' class ') || file_data_line.toLowerCase().includes(' interface ')) {

      //create a new class model
      var newClassModel = new ApexClassModel(classModelParent);
      newClassModel.fillDetails(file_data_line, commentList, i);
      commentList = [];

      // keep track of the new class, as long as it wasn't a single liner {}
      // but handle not having any curlies on the class line!
      if(openBraceCount == 0 || openBraceCount != closeBraceCount) {
        classModelStack.push(newClassModel);
        classModel = newClassModel;
      }

      // If we have a parent, add this class to it. Otherwise set this as the parent
      if(classModelParent) {
        classModelParent.addChildClass(newClassModel);
      }
      else {
        classModelParent = newClassModel;
      }
      continue;
    }

    // look for a method
    if(file_data_line.includes('(') && classModel) {
      // deal with a method over multiple lines
      while(!file_data_line.includes(')')) {
        i++;
        file_data_line += file_data_array[i];
      }
      var methodModel = new ApexMethodModel();
      methodModel.fillDetails(file_data_line, commentList, i);
      classModel.addMethod(methodModel);
      commentList = [];
      continue;
    }

    // handle set & get within the property
    if(file_data_line.includes(' get ') ||
        file_data_line.includes(' set ') ||
        file_data_line.includes(' get;') ||
        file_data_line.includes(' set;') ||
        file_data_line.includes(' get{') ||
        file_data_line.includes(' set{')) {
      continue;
    }

    if(classModel) {
      // must be a property
      var propertyModel = new ApexPropertyModel();
      propertyModel.fillDetails(file_data_line, commentList, i);
      classModel.addProperty(propertyModel);
      commentList = [];
    }
  }

  return classModelParent;
}
module.exports.processFile = processFile;