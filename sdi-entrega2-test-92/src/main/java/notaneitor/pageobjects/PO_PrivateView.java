package notaneitor.pageobjects;

import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_PrivateView extends PO_NavView {

    public static void checkUser(WebDriver driver, String user){
        String checkText = user;
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    public static void clickElement(WebDriver driver, int position) {
        driver.findElements(By.className("btnSendFR")).get(position).click();
    }

    static public void goToNextPage(WebDriver driver){
        List<WebElement> elements = checkElementBy(driver,"free","//li[contains(@id,'pag')]/a");
        elements.get(0).click();
    }
}
