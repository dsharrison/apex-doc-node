/**
 * This is my test class declaration.
 * @author  Derrek Harrison
 * @date    1-1-2014
 * @group   Tests
 */
public class TestClass {

  /**
   * This is my test integer property.
   */
  public Integer myInt {get;set;}

  /**
   * This is my test string property.
   */
  private String myString {get;set;}

  /**
   * These are the seasons
   */
  public enum Seasons {
    SPRING,
    SUMMER,
    FALL,
    WINTER
  }

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
   * @param  intParam     The integer to method. This description wraps for
   *                      multiple lines!
   * @param  notUsed      This parameter is not used.
   *
   * @return              Always returns param + 1;
   */
  public Integer myMethod(Integer intParam, Integer notUsed) {
    return intParam + 1;
  }

  /**
   * Standard constructor.
   *
   * @example
   * TestClass t = new TestClass();
   *
   * if(t.noDocBoolean != true) {
   *   System.Debug('Whoa, not true dude.');
   * }
   */
  public TestClass() {
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
