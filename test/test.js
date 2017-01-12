var expect    = require('chai').expect;
var app       = require('../apex-doc-node');
var parser    = require('../lib/parser');
var fs        = require('fs');
var config    = require('../lib/util/config');
var report    = require('../lib/report');

describe('Apex Doc Parser', function(){
  describe('Single class and subclass parse', function(){

    // Read in test file
    var file_data = fs.readFileSync(getFilePath('/test/data/TestClass.cls'));

    // Setup config
    config.data.scopes = ['global', 'webservice', 'public'];

    // Run parser
    var classModel = parser.processFile('TestClass.cls', file_data);

    it('parses parent class information', function(){

      // Parent Class
      expect(classModel).to.not.equal(null);
      expect(classModel.name).to.equal('TestClass');
    });
    it('parses parent class properties', function(){
      // Parent Class Properties
      expect(classModel.properties.length).to.equal(2);
      var apexProperty = classModel.properties[0];
      expect(apexProperty.name).to.equal('myInt');
      expect(apexProperty.description).to.equal('This is my test integer property.');
      apexProperty = classModel.properties[1];
      expect(apexProperty.name).to.equal('noDocBoolean');
      expect(apexProperty.description).to.equal(null);

      expect(classModel.enums.length).to.equal(1);
      var apexEnum = classModel.enums[0];
      expect(apexEnum.className).to.equal('Seasons');
      expect(apexEnum.values.length).to.equal(4);
    });
    it('parses parent class constructors and methods', function(){

      // Parent Class Constructors
      expect(classModel.constructors.length).to.equal(1);
      var apexMethod = classModel.constructors[0];
      expect(apexMethod.name).to.equal('TestClass');
      expect(apexMethod.description).to.equal('Standard constructor.');
      expect(apexMethod.example).to.equal('TestClass t = new TestClass();\n\nif(t.noDocBoolean != true) {\n  System.Debug(\'Whoa, not true dude.\');\n}\n');

      // Parent Class Methods
      expect(classModel.methods.length).to.equal(1);
      apexMethod = classModel.methods[0];
      expect(apexMethod.name).to.equal('myMethod');
      expect(apexMethod.nameWithParams).to.equal('myMethod(Integer intParam, Integer notUsed)');
      expect(apexMethod.description).to.equal('This is my sample method with a short description. <p> This is a longer description of the functionality provided by the method!');
      expect(apexMethod.return).to.equal('Always returns param + 1;');
      expect(apexMethod.param.length).to.equal(2);
      var apexMethodParam = apexMethod.param[0];
      expect(apexMethodParam.name).to.equal('intParam');
      expect(apexMethodParam.description).to.equal('The integer to method. This description wraps for multiple lines!');
      apexMethodParam = apexMethod.param[1];
      expect(apexMethodParam.name).to.equal('notUsed');
      expect(apexMethodParam.description).to.equal('This parameter is not used.');
    });
    it('parses child class information', function(){
      // Child classes
      expect(classModel.childClasses.length).to.equal(1);
      var childClass = classModel.childClasses[0];
      expect(childClass.name).to.equal('TestClass.InnerClass');
      expect(childClass.className).to.equal('InnerClass');
    });

    // Read in test file
    file_data = fs.readFileSync(getFilePath('/test/data/TestCoverage.cls'));

    // Run parser
    var coverageClass = parser.processFile('TestCoverage.cls', file_data);

    it('analyzes documentation coverage', function(){
      coverageClass = report.analyzeClass(coverageClass);

      //Assert class coverage
      var current = coverageClass;
      expect(current.nElements).to.equal(13);
      expect(current.nDocumentedElements).to.equal(6);
      expect(current.elementCoverage).to.equal((6/13 * 100).toFixed(2));

      //Assert methods coverage
      current = coverageClass.methodAnalysis;
      expect(current.nElements).to.equal(2);
      expect(current.nDocumentedElements).to.equal(1);
      expect(current.elementCoverage).to.equal((1/2 * 100).toFixed(2));

      //Assert constructor coverage
      current = coverageClass.constructorAnalysis;
      expect(current.nElements).to.equal(2);
      expect(current.nDocumentedElements).to.equal(1);
      expect(current.elementCoverage).to.equal((1/2 * 100).toFixed(2));

      //Assert property coverage
      current = coverageClass.propertyAnalysis;
      expect(current.nElements).to.equal(4);
      expect(current.nDocumentedElements).to.equal(2);
      expect(current.elementCoverage).to.equal((2/4 * 100).toFixed(2));

      //Assert child class coverage
      current = coverageClass.childClasses[0];
      expect(current.nElements).to.equal(4);
      expect(current.nDocumentedElements).to.equal(1);
      expect(current.elementCoverage).to.equal((1/4 * 100).toFixed(2));

      //Assert child class method coverage
      current = coverageClass.childClasses[0].methodAnalysis;
      expect(current.nElements).to.equal(1);
      expect(current.nDocumentedElements).to.equal(1);
      expect(current.elementCoverage).to.equal((1/1 * 100).toFixed(2));

      //Assert child class constructor coverage
      current = coverageClass.childClasses[0].constructorAnalysis;
      expect(current.nElements).to.equal(0);
      expect(current.nDocumentedElements).to.equal(0);
      expect(current.elementCoverage).to.equal((0 * 100).toFixed(2));

      //Assert child class property coverage
      current = coverageClass.childClasses[0].propertyAnalysis;
      expect(current.nElements).to.equal(2);
      expect(current.nDocumentedElements).to.equal(0);
      expect(current.elementCoverage).to.equal((0 * 100).toFixed(2));
    });
  });
});