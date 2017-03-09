var output = require(getFilePath('/lib/output'));
var config = require(getFilePath('/lib/util/config'));

var suppressLogging = false;

var analyze = function(reportMap) {

  var nClasses = reportMap.totalClasses;
  var nElements = 0;
  var nDocumentedElements = 0;
  var elementCoverage = (0).toFixed(2);

  for(var i = 0; i < reportMap.length; i++) {

    for(var n = 0; n < reportMap[i].classes.length; n++) {

      var currentClass = reportMap[i].classes[n];
      console.dir(currentClass);
      currentClass = analyzeClass(currentClass, false);
      nElements += currentClass.nElements;
      nDocumentedElements += currentClass.nDocumentedElements;

      if(!suppressLogging) {
        output.printSecondaryMessage(currentClass.name + ': ' + currentClass.nDocumentedElements + '/' + currentClass.nElements + '(' + currentClass.elementCoverage + '%)');
        output.printSecondaryMessage('  - Description: ' + (currentClass.isDocumented ? 1 : 0) + '/' + 1 + '(' + (currentClass.isDocumented ? 100.00 : 0.00) + '%)');

        if(currentClass.hasConstructors) {
          output.printSecondaryMessage('  - Constructors: ' + currentClass.constructorAnalysis.nDocumentedElements + '/' + currentClass.constructorAnalysis.nElements + '(' + currentClass.constructorAnalysis.elementCoverage + '%)');
        }
        if(currentClass.hasProperties) {
          output.printSecondaryMessage('  - Properties: ' + currentClass.propertyAnalysis.nDocumentedElements + '/' + currentClass.propertyAnalysis.nElements + '(' + currentClass.propertyAnalysis.elementCoverage + '%)');
        }
        if(currentClass.hasMethods) {
          output.printSecondaryMessage('  - Methods: ' + currentClass.methodAnalysis.nDocumentedElements + '/' + currentClass.methodAnalysis.nElements + '(' + currentClass.methodAnalysis.elementCoverage + '%)');
        }
        if(currentClass.childClasses.length > 0) {
          output.printSecondaryMessage('  - Child Class Elements: ' + currentClass.childClassAnalysis.nDocumentedElements + '/' + currentClass.childClassAnalysis.nElements + '(' + currentClass.childClassAnalysis.elementCoverage + '%)');
        }
      }
    }
  }
  if(nElements != 0) {
    elementCoverage = nDocumentedElements / nElements * 100;
    elementCoverage = elementCoverage.toFixed(2);
  }

  if(!suppressLogging) {
    output.printSecondaryMessage('Total Coverage: ' + nDocumentedElements + '/' + nElements + '(' + elementCoverage + '%)');
  }

  module.exports.nElements = nElements;
  module.exports.nDocumentedElements = nDocumentedElements;
  module.exports.elementCoverage = elementCoverage;
  module.exports.rating = assessRating(elementCoverage);

  return reportMap;
}
module.exports.analyze = analyze;

var analyzeClass = function(currentClass) {
  if(currentClass === null) {
    return currentClass;
  }

  currentClass.isDocumented = (currentClass.description !== null);

  currentClass.nElements = 0;
  currentClass.nDocumentedElements = 0;
  currentClass.elementCoverage = (0).toFixed(2);

  //Account for class description
  currentClass.nElements++;
  if(currentClass.isDocumented) {
    currentClass.nDocumentedElements++;
  }

  /* METHODS */
  var methodAnalysis = {
    nElements: 0,
    nDocumentedElements: 0,
    elementCoverage: (0).toFixed(2)
  };
  if(currentClass.hasMethods) {
    methodAnalysis = analyzeList(currentClass.methods);
    currentClass.nElements += methodAnalysis.nElements;
    currentClass.nDocumentedElements += methodAnalysis.nDocumentedElements;
  }
  currentClass.methodAnalysis = methodAnalysis;

  /* PROPERTIES & ENUMS*/
  var propertyAnalysis = {
    nElements: 0,
    nDocumentedElements: 0,
    elementCoverage: (0).toFixed(2)
  };
  if(currentClass.hasProperties || currentClass.hasEnums) {
    //Concatenate properties and enums
    if(!currentClass.hasProperties) {
      currentClass.properties = [];
    }
    if(!currentClass.hasEnums) {
      currentClass.enums = [];
    }
    var concatenatedArray = currentClass.properties.concat(currentClass.enums);
    propertyAnalysis = analyzeList(concatenatedArray);
    currentClass.nElements += propertyAnalysis.nElements;
    currentClass.nDocumentedElements += propertyAnalysis.nDocumentedElements;
  }
  currentClass.propertyAnalysis = propertyAnalysis;

  /* CONSTRUCTORS */
  var constructorAnalysis = {
    nElements: 0,
    nDocumentedElements: 0,
    elementCoverage: (0).toFixed(2)
  };
  if(currentClass.hasConstructors) {
    constructorAnalysis = analyzeList(currentClass.constructors);
    currentClass.nElements += constructorAnalysis.nElements;
    currentClass.nDocumentedElements += constructorAnalysis.nDocumentedElements;
  }
  currentClass.constructorAnalysis = constructorAnalysis;


  /* CHILD CLASSES */
  var childClassAnalysis = {
    nElements: 0,
    nDocumentedElements: 0,
    elementCoverage: (0).toFixed(2)
  };

  for(var i = 0; i < currentClass.childClasses.length; i++) {
    var tempClass = analyzeClass(currentClass.childClasses[i]);
    childClassAnalysis.nElements += tempClass.nElements;
    childClassAnalysis.nDocumentedElements += tempClass.nDocumentedElements;
  }
  currentClass.nElements += childClassAnalysis.nElements;
  currentClass.nDocumentedElements += childClassAnalysis.nDocumentedElements;

  if(childClassAnalysis.nElements > 0) {
    childClassAnalysis.elementCoverage = childClassAnalysis.nDocumentedElements / childClassAnalysis.nElements * 100;
    childClassAnalysis.elementCoverage = childClassAnalysis.elementCoverage.toFixed(2);
  }
  childClassAnalysis.rating = assessRating(childClassAnalysis.elementCoverage);
  currentClass.childClassAnalysis = childClassAnalysis;
  currentClass.hasChildClasses = (currentClass.childClasses.length > 0) ? true : false;


  /* TALLY CURRENT CLASS */
  if(currentClass.nElements != 0) {
    currentClass.elementCoverage = currentClass.nDocumentedElements / currentClass.nElements * 100;
    currentClass.elementCoverage = currentClass.elementCoverage.toFixed(2);
  }
  currentClass.rating = assessRating(currentClass.elementCoverage);

  return currentClass;
}
module.exports.analyzeClass = analyzeClass;

function analyzeList(sublist) {
  if(sublist === null) {
    return sublist;
  }
  var nElements = sublist.length;
  var nDocumentedElements = 0;
  for(var i = 0; i < sublist.length; i++) {
    var currentElement = sublist[i];

    if(currentElement.description !== null) {
      nDocumentedElements++;
    }
  }

  var elementCoverage = (0).toFixed(2);

  if(nElements != 0) {
    elementCoverage = nDocumentedElements / nElements * 100;
    elementCoverage = elementCoverage.toFixed(2);
  }

  var result = {
    elementCoverage: elementCoverage,
    nElements: nElements,
    nDocumentedElements: nDocumentedElements,
    rating: assessRating(elementCoverage)
  };

  return result;
}

function assessRating(elementCoverage) {
  var rating = {
    good: false,
    poor: false,
    bad: false
  };

  if(elementCoverage >= config.data.report.ratings.good) {
    rating.good = true;
  }
  else if(elementCoverage >= config.data.report.ratings.poor) {
    rating.poor = true;
  }
  else {
    rating.bad = true;
  }

  return rating;
}
