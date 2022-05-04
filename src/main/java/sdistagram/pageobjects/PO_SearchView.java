package sdistagram.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_SearchView extends PO_NavView{

    static public void fillForm(WebDriver driver, String txt){

        WebElement text = driver.findElement(By.name("searchText"));
        text.click();
        text.clear();
        text.sendKeys(txt);

        //pulsar boton
        By boton = By.className("btn");
        driver.findElement(boton).click();

    }
}
