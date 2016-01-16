/**
 * This is my test class declaration.
 * @author  Derrek Harrison
 * @date    1-1-2014
 */
public class TestClass2 {

  //Missing doc
  public Integer myInt {get;set;}

  /**
   * This is my test string property.
   */
  private String myString {get;set;}

  public Boolean noDocBoolean {
    get;
    set;
  }

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
  public Integer myMethod(Integer intParam, Integer notUsed) {
    return intParam + 1;
  }

  //Missing shit
  public Integer myMethod(Integer intParam, Integer notUsed) {
    return intParam + 1;
  }

  /**
   * Standard constructor.
   *
   * @example
   * TestClass2 t = new TestClass2();
   */
  public TestClass2() {
    // Constructor
  }


  public class InnerClass {

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