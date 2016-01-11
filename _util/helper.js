var fs = require('fs');

var config = require(getFilePath('/_util/config.js'));

var getScopeFromString = function(string_to_search) {
  string_to_search = string_to_search.toLowerCase();
  for(var i = 0; i < config.data.scopes.length; i++) {
    if(string_to_search.includes(config.data.scopes[i].toLowerCase() + ' ')) {
      return config.data.scopes[i];
    }
  }
  return null;
}
module.exports.getScopeFromString = getScopeFromString;

var countStringMatches = function(string_to_find, string_to_search) {
  return (string_to_search.split(string_to_find).length - 1);
}
module.exports.countStringMatches = countStringMatches;

var parseTokens = function(model, tokens, commentList) {
  var inDescription = false;
  var token_obj;
  var token;
  var token_name;

  // Initialize token properties on the object
  for(var x = 0; x < tokens.length; x++) {
    var x_token_obj = tokens[x];
    var x_token = x_token_obj.name;
    var x_token_name = x_token.replace('@', '');
    if(x_token_obj['type'] == 'array') {
      if(!model[x_token_name]) {
        model[x_token_name] = [];
      }
    }
    else if(x_token_obj['type'] == 'array-typed') {
      if(!model[x_token_name]) {
        var token_model = x_token_obj['model'];
        if(typeof this[token_model] === 'undefined') {
          this[token_model] = require(getFilePath('/_models/' + token_model));
        }
        model[x_token_name] = null;
      }

    }
    else {
      model[x_token_name] = null;
    }
  }

  // Loop through comment lines looking for tokens
  for(var i = 0; i < commentList.length; i++) {
    var comment = commentList[i].trim();
    var token_start;

    var matchedToken = null;
    for(var x = 0; x < tokens.length; x++) {
      var x_token_obj = tokens[x];
      var x_token = x_token_obj.name;
      var x_token_name = x_token.replace('@', '');
      token_start = comment.toLowerCase().indexOf(x_token);
      if(token_start > -1) {
        token_obj = x_token_obj;
        token = x_token;
        token_name = x_token_name;
        comment = comment.replace('/**', '').trim();
        comment = comment.replace('*/', '').trim();
        comment = comment.replace('*', '').trim();
        var comment_trimmed = comment.substring(token_start + token.length).trim();
        if(x_token_obj['type'] == 'array') {
          if(!model[token_name]) {
            model[token_name] = [];
          }
          model[token_name].push(comment_trimmed);
        }
        else if(x_token_obj['type'] == 'array-typed') {
          if(!model[token_name]) {
            var token_model = token_obj['model'];
            if(typeof this[token_model] === 'undefined') {
              this[token_model] = require('../_models/' + token_model);
            }
            model[token_name] = [];
          }
          model[token_name].push(new this[token_model](comment_trimmed));

        }
        else {
          model[token_name] = comment_trimmed;
        }
        inDescription = false;
        matchedToken = true;
      }
    }

    if(!matchedToken) {
      if(token == null) {
        token = '@description';
        token_name = 'description';
      }
      comment = comment.replace('/**', '').trim();
      comment = comment.replace('*/', '').trim();
      comment = comment.replace('*', '').trim();
      if(comment.length > 0) {
        if(token_obj && token_obj['type'] == 'array' && model[token_name][model[token_name.length - 1]]) {
          model[token_name][model[token_name.length - 1]] += comment.trim();
        }
        if(token_obj && token_obj['type'] == 'array-typed' && model[token_name][model[token_name.length - 1]]) {
          model[token_name][model[token_name.length - 1]].addLine(comment.trim());
        }
        else {
          if(!model[token_name]) {
            model[token_name] = '';
          }
          else {
            model[token_name] += ' ';
          }
          model[token_name] += comment.trim();
        }
      }
    }
  }
}
module.exports.parseTokens = parseTokens;

var trimForComments = function(string_to_trim) {
  // Check to see if we have a single line comment
  var comment_index = string_to_trim.indexOf('//');

  // If we do, take only the part of the line before it
  if(comment_index > -1) {
    string_to_trim = string_to_trim.substring(0, comment_index);
  }
  return string_to_trim;
}
module.exports.trimForComments = trimForComments;

var getPreviousWord = function(str, index) {
  var result;
  if(str && str.length > index) {
    var index_f;
    var index_l;
    for(index_f = index - 1, index_l = 0; index_f >= 0; index_f--) {
      if(index_l == 0) {
        if(str.charAt(index_f) == ' ') {
          continue;
        }
        index_l = index_f + 1;
      }
      else if(str.charAt(index_f) == ' ') {
        index_f++;
        break;
      }
    }
    if(index_f >= 0) {
      result = str.substring(index_f, index_l);
    }
  }

  return result;
}
module.exports.getPreviousWord = getPreviousWord;

var copyFile = function(source, target, cb) {

  console.log('* Copying file ' + source + ' to ' + target);

  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if(err) {
      throw err;
    }
    if (!cbCalled && typeof cb !== 'undefined') {
      cb(err);
      cbCalled = true;
    }
  }
}
module.exports.copyFile = copyFile;

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var refreshFolder = function(path) {
  if(fs.existsSync(path + 'index.html')) {
    deleteFolderRecursive(path);
    fs.mkdirSync(path);
  }
  else {
    console.log('* Not clearing your docs directory since no index.html was found.');
  }
}
module.exports.refreshFolder = refreshFolder;