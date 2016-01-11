var expect    = require("chai").expect;
var parser    = require("../_lib/parser");
var fs        = require("fs");
var config    = require("../_util/config");

describe("Apex Doc Parser", function(){
  describe("Single class and subclass parse", function(){

    // Read in test file
    var file_data = fs.readFileSync("./_test/data/TestClass.cls");

    // Setup config
    config.scopes = ["global", "webservice", "public"];

    // Run parser
    var classModel = parser.processFile("TestClass.cls", file_data);

    it("parses parent class information", function(){

      // Parent Class
      expect(classModel).to.not.equal(null);
      expect(classModel.name).to.equal("TestClass");
    });
    it("parses parent class properties", function(){
      // Parent Class Properties
      expect(classModel.properties.length).to.equal(2);
      var apexProperty = classModel.properties[0];
      expect(apexProperty.name).to.equal("myInt");
      expect(apexProperty.description).to.equal("This is my test integer property.");
      apexProperty = classModel.properties[1];
      expect(apexProperty.name).to.equal("noDocBoolean");
      expect(apexProperty.description).to.equal(null);

    });
    it("parses parent class constructors and methods", function(){

      // Parent Class Constructors
      expect(classModel.constructors.length).to.equal(1);
      var apexMethod = classModel.constructors[0];
      expect(apexMethod.name).to.equal("TestClass");
      expect(apexMethod.description).to.equal("Standard constructor.");
      expect(apexMethod.example).to.equal("TestClass t = new TestClass();");

      // Parent Class Methods
      expect(classModel.methods.length).to.equal(1);
      apexMethod = classModel.methods[0];
      expect(apexMethod.name).to.equal("myMethod");
      expect(apexMethod.nameWithParams).to.equal("myMethod(Integer intParam, Integer notUsed)");
      expect(apexMethod.description).to.equal("This is my sample method with a short description. <p> This is a longer description of the functionality provided by the method!");
      expect(apexMethod.return).to.equal("Always returns param + 1;");
      expect(apexMethod.param.length).to.equal(2);
      var apexMethodParam = apexMethod.param[0];
      expect(apexMethodParam.name).to.equal("intParam");
      expect(apexMethodParam.description).to.equal("The integer to method.");
      apexMethodParam = apexMethod.param[1];
      expect(apexMethodParam.name).to.equal("notUsed");
      expect(apexMethodParam.description).to.equal("This parameter is not used.");
    });
    it("parses child class information", function(){
      // Child classes
      expect(classModel.childClasses.length).to.equal(1);
      var childClass = classModel.childClasses[0];
      expect(childClass.name).to.equal("TestClass.InnerClass");
      expect(childClass.className).to.equal("InnerClass");
    });
  });
});