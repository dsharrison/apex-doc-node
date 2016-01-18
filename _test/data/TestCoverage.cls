/**
 * This is my test class declaration.
 * @author  Derrek Harrison
 * @date    1-1-2014
 */
public class TestCoverage {


  /**
   * Documented Property
   */
  public Integer documentedProperty {get;set;}

  public Integer undocumentedProperty {get;set;}

  /**
   * This is my sample method with a short description.
   * <p>
   * This is a longer description of the functionality provided
   * by the method!
   *
   * @param  intParam     The integer to method.
   * @param  notUsed      This parameter is not used.
   *
   * @return              Always returns param + 1;
   */
  public Integer documentedMethod(Integer intParam, Integer notUsed) {
    return intParam + 1;
  }

  public Integer undocumentedMethod(Integer intParam, Integer notUsed) {
    return intParam + 1;
  }

  /**
   * Standard constructor.
   *
   * @example
   * TestClass2 t = new TestClass2();
   */
  public TestCoverage() {
    // Constructor
  }

  public TestCoverage(String unDocumented) {
    // Constructor
  }


  public class unDocumentedInnerClass {

    public String innerString;

    /**
     * Return today's date.
     *
     * @return Always today's date.
     *
     * @example
     * System.debug('Today is ' + getToday());
     */
    public Date getToday() {
      return System.today();
    }

  }
}