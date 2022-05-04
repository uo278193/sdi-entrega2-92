package sdistagram.pageobjects;

import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_Logs extends PO_NavView{

    static public void checkLogType(WebDriver driver,String type, int size) {
        List<WebElement> result = PO_View.checkElementBy(driver, "text", type);
        Assertions.assertEquals(size, result.size());
    }
    static public void checkAtLeastLogType(WebDriver driver,String type, int size) {
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", type);
        Assertions.assertTrue(elements.size()>size);
    }
}
