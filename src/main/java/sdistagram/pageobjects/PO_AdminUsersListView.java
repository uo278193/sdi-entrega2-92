package sdistagram.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_AdminUsersListView extends PO_NavView {

    static public void markCheckBoxElements(WebDriver driver, List<Integer> positions) {
        int counter = 0;
        for (WebElement element : driver.findElements(By.className("chkUser"))) {
            if(positions.contains(counter))
                element.click();
            counter++;
        }
    }

    static public void clickBtn(WebDriver driver){
        driver.findElement(By.className("btn-primary")).click();
    }

    static public int countUsers(WebDriver driver){
        return driver.findElements(By.id("chkUser")).size();
    }

    static public WebElement getUser(WebDriver driver, int position){
        WebElement element = driver.findElements(By.className("chkUser")).get(position);
        return element;
    }

    static public boolean checkUserInList(WebDriver driver, WebElement user){
        return (driver.findElements(By.className("chkUser")).contains(user));
    }
}
