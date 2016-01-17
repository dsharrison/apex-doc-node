var output = require(getFilePath('/_lib/output'));

var analyze = function (reportMap){
    var nClasses = reportMap.length;
    var nElements = 0;
    var nDocumentedElements = 0;

    for (var i = 0; i < reportMap.length; i++){
        var currentClass = reportMap[i];
        currentClass = analyzeClass(currentClass, false);
        nElements += currentClass.nElements;
        nDocumentedElements += currentClass.nDocumentedElements;
    }
    if (nElements != 0){
        elementCoverage = nDocumentedElements / nElements * 100;
        elementCoverage = elementCoverage.toFixed(2);
    }
    var elementCoverage = 

    output.printSecondaryMessage('Total Coverage: ' + nDocumentedElements + '/' + nElements + '(' + elementCoverage + '%)');


    return reportMap;
}
module.exports.analyze = analyze;

function analyzeClass(currentClass, isChildClass){
    if (currentClass === null){
        return currentClass;
    }

    var tabulation = '';
    if (isChildClass){
        tabulation = '    '
    }

    currentClass.isDocumented = (currentClass.description !== null);

    currentClass.nDocumentedElements = 0;
    currentClass.nElements = 0;
    currentClass.elementCoverage = 0;

    //Account for class description
    currentClass.nElements++;
    if (currentClass.isDocumented){
        currentClass.nDocumentedElements++;
    }

    /* METHODS */
    var methodAnalysis;
    if (currentClass.hasMethods){
        methodAnalysis = analyzeList(currentClass.methods);
        currentClass.nElements += methodAnalysis.nElements;
        currentClass.nDocumentedElements += methodAnalysis.nDocumentedElements;
    }
    
    /* PROPERTIES */
    var propertyAnalysis;
    if (currentClass.hasProperties){
        propertyAnalysis = analyzeList(currentClass.properties);
        currentClass.nElements += propertyAnalysis.nElements;
        currentClass.nDocumentedElements += propertyAnalysis.nDocumentedElements;
    }

    /* CONSTRUCTORS */
    var constructorAnalysis;
    if (currentClass.hasConstructors){
        constructorAnalysis = analyzeList(currentClass.constructors);
        currentClass.nElements += constructorAnalysis.nElements;
        currentClass.nDocumentedElements += constructorAnalysis.nDocumentedElements;
    }

    /* CHILD CLASSES */
    var childClassAnalysis = {
        nElements : 0,
        nDocumentedElements : 0,
        elementCoverage : 0
    };

    for (var i = 0; i < currentClass.childClasses.length; i++){
        var tempClass = analyzeClass(currentClass.childClasses[i], true);
        childClassAnalysis.nElements += tempClass.nElements;
        childClassAnalysis.nDocumentedElements += tempClass.nDocumentedElements;
    }
    currentClass.nElements += childClassAnalysis.nElements;
    currentClass.nDocumentedElements += childClassAnalysis.nDocumentedElements;

    if (childClassAnalysis.nElements > 0){
        childClassAnalysis.elementCoverage = childClassAnalysis.nDocumentedElements / childClassAnalysis.nElements * 100;
        childClassAnalysis.elementCoverage = childClassAnalysis.elementCoverage.toFixed(2);
    }

    /* TALLY CURRENT CLASS */
    if (currentClass.nElements != 0){
        currentClass.elementCoverage = currentClass.nDocumentedElements / currentClass.nElements * 100;
        currentClass.elementCoverage = currentClass.elementCoverage.toFixed(2);
    }

    /* PRINT OUT DETAILS */
    if (!isChildClass){
        output.printSecondaryMessage(tabulation + currentClass.name + ': ' + currentClass.nDocumentedElements + '/' + currentClass.nElements + '(' + currentClass.elementCoverage + '%)');
        output.printSecondaryMessage(tabulation + '  - Description: '+ (currentClass.isDocumented ? 1 : 0) + '/' + 1 + '(' + (currentClass.isDocumented ? 100.00 : 0.00) + '%)');
        
        if (currentClass.hasConstructors){
            output.printSecondaryMessage(tabulation + '  - Constructors: '+ constructorAnalysis.nDocumentedElements + '/' + constructorAnalysis.nElements + '(' + constructorAnalysis.elementCoverage + '%)');
        }
        if (currentClass.hasProperties){
            output.printSecondaryMessage(tabulation + '  - Properties: '+ propertyAnalysis.nDocumentedElements + '/' + propertyAnalysis.nElements + '(' + propertyAnalysis.elementCoverage + '%)');
        }
        if (currentClass.hasMethods){
            output.printSecondaryMessage(tabulation + '  - Methods: '+ methodAnalysis.nDocumentedElements + '/' + methodAnalysis.nElements + '(' + methodAnalysis.elementCoverage + '%)');
        }
        if (currentClass.childClasses.length > 0){
            output.printSecondaryMessage(tabulation + '  - Child Class Elements: '+ childClassAnalysis.nDocumentedElements + '/' + childClassAnalysis.nElements + '(' + childClassAnalysis.elementCoverage + '%)');
        }
        
    }

    return currentClass;   
}

function analyzeList(sublist){
    if (sublist === null){
        return sublist;
    }
    var nElements = sublist.length;
    var nDocumentedElements = 0;
    for (var i = 0; i < sublist.length; i++){
        var currentElement = sublist[i];

        if (currentElement.description !== null){
            nDocumentedElements++;
        }
    }

    var elementCoverage = null;

    if (nElements != 0){
        elementCoverage = nDocumentedElements / nElements * 100;
        elementCoverage = elementCoverage.toFixed(2);
    }

    var result = {
        elementCoverage : elementCoverage,
        nElements : nElements,
        nDocumentedElements : nDocumentedElements
    };

    return result;
}