package notaneitor.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_SignUpView extends PO_NavView {

    static public void fillForm(WebDriver driver, String emailp, String namep, String lastnamep, String
            passwordp, String pass2) {
        WebElement name = driver.findElement(By.name("nombre"));
        name.click();
        name.clear();
        name.sendKeys(namep);
        WebElement lastname = driver.findElement(By.name("apellidos"));
        lastname.click();
        lastname.clear();
        lastname.sendKeys(lastnamep);
        WebElement email = driver.findElement(By.name("email"));
        email.click();
        email.clear();
        email.sendKeys(emailp);
        WebElement password = driver.findElement(By.name("password"));
        password.click();
        password.clear();
        password.sendKeys(passwordp);
        WebElement password2 = driver.findElement(By.name("password2"));
        password2.click();
        password2.clear();
        password2.sendKeys(pass2);
        //Pulsar el boton de Alta.
        By boton = By.className("btn");
        driver.findElement(boton).click();
    }
}
