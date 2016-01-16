"use strict";

function loadJSON(){
  return JSON.parse('[ { "isInterface": false, "childClasses": [ { "parentName": "TestClass", "isInterface": false, "childClasses": [], "methods": [ { "nameLine": "public Date getToday()", "nameLineNumber": 60, "scope": "public", "name": "getToday", "nameWithParams": "getToday()", "author": null, "date": null, "return": "lways today\'s date.", "example": "System.debug(\'Today is \' + getToday());", "param": null, "description": "Return today\'s date." } ], "hasMethods": true, "constructors": [], "hasConstructors": false, "properties": [ { "name": "innerString", "nameLine": "public String innerString", "nameLineNumber": 50, "scope": "public", "description": null } ], "hasProperties": true, "nameLine": "public class InnerClass", "nameLineNumber": 48, "name": "TestClass.InnerClass", "className": "InnerClass", "scope": "public", "author": null, "date": null, "group": null, "group-content": null, "description": null } ], "methods": [ { "nameLine": "public Integer myMethod(Integer intParam, Integer notUsed)", "nameLineNumber": 33, "scope": "public", "name": "myMethod", "nameWithParams": "myMethod(Integer intParam, Integer notUsed)", "author": null, "date": null, "return": "Always returns param + 1;", "example": null, "param": [ { "name": "intParam", "description": "The integer to method." }, { "name": "notUsed", "description": "This parameter is not used." } ], "description": "This is my sample method with a short description. <p> This is a longer description of the functionality provided by the method!", "hasParams": true } ], "hasMethods": true, "constructors": [ { "nameLine": "public TestClass()", "nameLineNumber": 43, "scope": "public", "name": "TestClass", "nameWithParams": "TestClass()", "author": null, "date": null, "return": null, "example": "TestClass t = new TestClass();", "param": null, "description": "Standard constructor." } ], "hasConstructors": true, "properties": [ { "name": "myInt", "nameLine": "public Integer myInt", "nameLineNumber": 10, "scope": "public", "description": "This is my test integer property." }, { "name": "myString", "nameLine": "private String myString", "nameLineNumber": 15, "scope": "private", "description": "This is my test string property." }, { "name": "noDocBoolean", "nameLine": "public Boolean noDocBoolean", "nameLineNumber": 17, "scope": "public", "description": null } ], "hasProperties": true, "nameLine": "public class TestClass", "nameLineNumber": 5, "name": "TestClass", "className": "TestClass", "scope": "public", "author": "Derrek Harrison", "date": "1-1-2014", "group": null, "group-content": null, "description": "This is my test class declaration." }, { "isInterface": false, "childClasses": [ { "parentName": "TestClass2", "isInterface": false, "childClasses": [], "methods": [ { "nameLine": "public Date getToday()", "nameLineNumber": 63, "scope": "public", "name": "getToday", "nameWithParams": "getToday()", "author": null, "date": null, "return": "lways today\'s date.", "example": "System.debug(\'Today is \' + getToday());", "param": null, "description": "Return today\'s date." } ], "hasMethods": true, "constructors": [], "hasConstructors": false, "properties": [ { "name": "innerString", "nameLine": "public String innerString", "nameLineNumber": 53, "scope": "public", "description": null } ], "hasProperties": true, "nameLine": "public class InnerClass", "nameLineNumber": 51, "name": "TestClass2.InnerClass", "className": "InnerClass", "scope": "public", "author": null, "date": null, "group": null, "group-content": null, "description": null } ], "methods": [ { "nameLine": "public Integer myMethod(Integer intParam, Integer notUsed)", "nameLineNumber": 31, "scope": "public", "name": "myMethod", "nameWithParams": "myMethod(Integer intParam, Integer notUsed)", "author": null, "date": null, "return": "Always returns param + 1;", "example": null, "param": [ { "name": "intParam", "description": "The integer to method." }, { "name": "notUsed", "description": "This parameter is not used." } ], "description": "This is my sample method with a short description. <p> This is a longer description of the functionality provided by the method!", "hasParams": true }, { "nameLine": "public Integer myMethod(Integer intParam, Integer notUsed)", "nameLineNumber": 36, "scope": "public", "name": "myMethod", "nameWithParams": "myMethod(Integer intParam, Integer notUsed)", "author": null, "date": null, "return": null, "example": null, "param": null, "description": null } ], "hasMethods": true, "constructors": [ { "nameLine": "public TestClass2()", "nameLineNumber": 46, "scope": "public", "name": "TestClass2", "nameWithParams": "TestClass2()", "author": null, "date": null, "return": null, "example": "TestClass2 t = new TestClass2();", "param": null, "description": "Standard constructor." } ], "hasConstructors": true, "properties": [ { "name": "myInt", "nameLine": "public Integer myInt", "nameLineNumber": 8, "scope": "public", "description": null }, { "name": "myString", "nameLine": "private String myString", "nameLineNumber": 13, "scope": "private", "description": "This is my test string property." }, { "name": "noDocBoolean", "nameLine": "public Boolean noDocBoolean", "nameLineNumber": 15, "scope": "public", "description": null } ], "hasProperties": true, "nameLine": "public class TestClass2", "nameLineNumber": 5, "name": "TestClass2", "className": "TestClass2", "scope": "public", "author": "Derrek Harrison", "date": "1-1-2014", "group": null, "group-content": null, "description": "This is my test class declaration." } ]');
}
/*console.log('init');
var jsonArray = loadJSON();
console.dir(jsonArray);
console.log('---------------------');
jsonArray = analyze(jsonArray);
console.log('result');
console.dir(jsonArray);
console.log('---------------------');*/


/*function loadJsonFromFile(){
    var JSON;

     $.getJSON('output.json', function(response){
           analyze(response);
           console.dir(jsonArray);
     })
     //.success(function() { alert("second success"); })
     .error(function() { alert("error"); })
     //.complete(function() { alert("complete"); });
}*/


function loadJsonFromFile() {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'output.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            //callback(xobj.responseText);
            analyze(xobj.responseText);
            console.dir(jsonArray);
          }
    };
    xobj.send(null);  
}

function analyze(reportMap){
    var nClasses = reportMap.length;
    var nDocumentedClass = 0;

    for (var i = 0; i < reportMap.length; i++){
        var currentClass = reportMap[i];
        currentClass = analyzeClass(currentClass);
    }

    return reportMap;
}

function analyzeClass(currentClass){
    if (currentClass === null){
        return currentClass;
    }

    if (currentClass.description !== null){
        currentClass.isDocumented = true;
    } else {
        currentClass.isDocumented = false;
    }

    /* METHODS */
    if (currentClass.hasMethods){
        currentClass.methods = analyzeList(currentClass.methods);
    }
    
    /* PROPERTIES */
    if (currentClass.hasProperties){
        currentClass.properties = analyzeList(currentClass.properties);
    }

    /* CHILD CLASSES */
    for (var i = 0; i < currentClass.childClasses.length; i++){
        currentClass.childClasses[i] = analyzeClass(currentClass.childClasses[i]);
    }

    /* CONSTRUCTORS */
    if (currentClass.hasConstructors){
        currentClass.constructors = analyzeList(currentClass.constructors);
    }
    
    return currentClass;   
}

function analyzeList(sublist){
    if (sublist === null){
        return sublist;
    }
    var nCurrentElements = sublist.length;
    var nCurrentDocumentedElements = 0;
    for (var i = 0; i < sublist.length; i++){
        var currentElement = sublist[i];

        if (currentElement.description !== null){
            nCurrentDocumentedElements++;
        }
    }

    var elementCoverage = null;

    if (nCurrentElements != 0){
        elementCoverage = nCurrentDocumentedElements / nCurrentElements * 100;
    }

    sublist.elementCoverage = elementCoverage;
    sublist.nCurrentElements = nCurrentElements;
    sublist.nCurrentDocumentedElements = nCurrentDocumentedElements;

    return sublist;
}

loadJsonFromFile();