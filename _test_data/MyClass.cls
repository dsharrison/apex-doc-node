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

  public Boolean noData {
    get;
    set;
  }

  /**
   * This is my test method.
   * @return Always returns 0
   */
  public Integer myMethod() {
    return 0;
  }

  public TestClass() {
    // Constructor
  }


  public class InnerClass {

    public String innerString;

  }
}