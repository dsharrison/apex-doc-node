var config = require('./config.js');

var getScopeFromString = function(string_to_search) {
  string_to_search = string_to_search.toLowerCase();
  for(var i = 0; i < config.scopes.length; i++) {
    if(string_to_search.includes(config.scopes[i].toLowerCase() + ' ')) {
      return config.scopes[i];
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
        var comment_trimmed = comment.substring(token_start + token.length).trim();
        if(x_token_obj['type'] == 'array') {
          if(!model[token_name]) {
            model[token_name] = [];
          }
          model[token_name].push(comment_trimmed);
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
      comment = comment.replace('* ', '').trim();
      if(comment.length > 0) {
        if(token_obj && token_obj['type'] == 'array') {
          model[token_name][model[token_name.length - 1]] += comment.trim();
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