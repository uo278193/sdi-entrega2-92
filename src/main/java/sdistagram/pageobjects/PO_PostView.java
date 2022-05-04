package sdistagram.pageobjects;

import com.uniovi.notaneitor.util.SeleniumUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_PostView extends PO_NavView {
    static public void fillForm(WebDriver driver, String tittle,String text){

        WebElement tittle1 = driver.findElement(By.name("tittle"));
        tittle1.click();
        tittle1.clear();
        tittle1.sendKeys(tittle);
        WebElement text1 = driver.findElement(By.name("text"));
        text1.click();
        text1.clear();
        text1.sendKeys(text);
        //Pulsar el boton de Alta.
        By boton = By.className("btn");
        driver.findElement(boton).click();

    }
    public static void postDropdown(WebDriver driver, String option){
        List<WebElement> gestUsersButton = SeleniumUtils.waitLoadElementsBy(driver, "id", "postDropdown", getTimeout());
        gestUsersButton.get(0).click();
        //Esperamos a que aparezca el menú de opciones.
        SeleniumUtils.waitLoadElementsBy(driver, "id", "postDropdownMenuButton", getTimeout());
        //CLickamos la opción elegida
        List<WebElement> selectedOption = SeleniumUtils.waitLoadElementsBy(driver, "id", option, getTimeout());
        selectedOption.get(0).click();
    }
}
