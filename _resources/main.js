(function(apexdoc, undefined) {

  if (!String.prototype.includes) {
    String.prototype.includes = function() {'use strict';
      return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
  }

  var search_el = document.getElementById('search');
  search_el.addEventListener('keyup', function(e){
    var search_val = e.target.value;
    console.log(search_val);

    var list = document.querySelectorAll('[data-define="class"]');
    Array.prototype.forEach.call(list, function(el, i){
      if(search_val) {
        var el_id = el.getAttribute('data-id');
        if(el_id.toLowerCase().includes(search_val.toLowerCase())) {
          el.style.display = '';
        }
        else {
          el.style.display = 'none';
        }
      }
      else {
        el.style.display = '';
      }
    });
  });

}(window.apexdoc = window.apexdoc || {}));