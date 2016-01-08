/**
 * This is my test class declaration.
 * @author  Derrek Harrison
 * @date    1-1-2014
 */
public class TestClass {

  /**
   * This is my test integer property.
   */
  public Integer myInt {get;set;}

  /**
   * This variable is always null. Have fun with it!
   */
  public Boolean noData {
    get;
    set;
  }

  /**
   * This is my sample method with a short description.
   * <p>
   * This is a longer description of the functionality provided
   * by the method!
   *
   * @param  param        The integer to method.
   *
   * @return              Always returns param + 1;
   */
  public Integer myMethod(Integer param) {
    return param + 1;
  }

  /**
   * Standard constructor.
   *
   * @example
   * TestClass t = new TestClass();
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