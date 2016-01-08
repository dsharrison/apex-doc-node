var fs = require('fs');
var Mustache = require('mustache');
var config = require('../_util/config');
var helper = require('../_util/helper');
var ncp = require('ncp').ncp;

// Include your partials in this list for them to be loaded
var mst_templates = {};
var template_dir = './_templates/';
var docs_dir = config.target || './docs/';

var printStatusMessage = function(message) {
  console.log('');
  console.log('//');
  console.log('// ' + message);
  console.log('// --------------------------------------------------');
}
module.exports.printStatusMessage = printStatusMessage;

var writeResult = function(classModels) {
  helper.refreshFolder(docs_dir);
  printStatusMessage('Writing raw data');
  fs.writeFileSync(docs_dir + 'output.json', JSON.stringify(classModels, null, '  '));
  console.log('* Results written to ' + docs_dir + 'output.json');
  printStatusMessage('Generating HTML files');

  loadMustacheTemplates();

  var docPage = {};
  docPage.classes = classModels;
  docPage.config = config;

  var template = getTemplate('layout');

  var html = Mustache.render(template, docPage, mst_templates);
  fs.writeFileSync(docs_dir + 'index.html', html);
  console.log('* Generated index.html');

  for(var i = 0; i < classModels.length; i++) {
    var currentClass = classModels[i];
    if(i > 0) {
      classModels[i - 1].isActive = false;
    }
    classModels[i].isActive = true;
    var name = currentClass.name;

    docPage.currentClass = currentClass;

    html = Mustache.render(template, docPage, mst_templates);
    fs.writeFileSync(docs_dir + name + '.html', html);
    console.log('* Generated ' + name + '.html');
  }

}
module.exports.writeResult = writeResult;

var copyResources = function() {
  var resources_dir = './_resources/';
  printStatusMessage('Copying resources from ' + resources_dir + ' to ' + docs_dir + 'resources/');
  /* if(!fs.existsSync(docs_dir + 'resources/')) {
    fs.mkdirSync(docs_dir + 'resources/');
  }
  var files = fs.readdirSync(resources_dir);
  files.forEach(function(file_name){
    helper.copyFile(resources_dir + file_name, docs_dir + 'resources/' + file_name);
  }); */
  ncp(resources_dir, docs_dir + 'resources/', function (err) {
   if (err) {
     return console.error(err);
   }
  });
}
module.exports.copyResources = copyResources;

var getTemplate = function(template_name) {
  var template;
  var_template_name_with_ext = template_name;
  if(template_name.endsWith('.mustache')) {
    template_name = template_name.substring(0, template_name.length - 9);
  }
  if(mst_templates[template_name]) {
    template = mst_templates[template_name];
  }
  else {
    template = fs.readFileSync(template_dir + template_name + '.mustache').toString();
    mst_templates[template_name] = template;
  }
  return template;
}

var loadMustacheTemplates = function() {
  var files = fs.readdirSync(template_dir);
  files.forEach(function(file_name){
    if(file_name.endsWith('.mustache')) {
      file_name = file_name.substring(0, file_name.length - 9);
    }
    mst_templates[file_name] = getTemplate(file_name);
  });
}