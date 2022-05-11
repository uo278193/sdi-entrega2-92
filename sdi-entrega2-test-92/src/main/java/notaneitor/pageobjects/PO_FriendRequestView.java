package notaneitor.pageobjects;

import notaneitor.util.SeleniumUtils;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_FriendRequestView extends PO_NavView{

    static public void checkNumberOfFriendRequest(WebDriver driver, int size) {
        List<WebElement> elements = PO_View.checkElementBy(driver, "free", "//*[@id=\"idTablaListaPeticionesAmistad\"]/tbody/tr");
        Assertions.assertEquals(size, elements.size());
    }
    public static void clickAcceptFriendRequest(WebDriver driver, String textOption, String criterio, String targetText) {
        //CLickamos en la opción de registro y esperamos a que se cargue el enlace de Registro.
        List<WebElement> elements = SeleniumUtils.waitLoadElementsBy(driver, "free", textOption, getTimeout());
        //Tiene que haber un sólo elemento.
        Assertions.assertEquals(1, elements.size());
        //Ahora lo submiteamos
        elements.get(0).submit();
        //Esperamos a que sea visible un elemento concreto
        elements = SeleniumUtils.waitLoadElementsBy(driver, criterio, targetText, getTimeout());
        //Tiene que haber un sólo elemento.
        Assertions.assertEquals(1, elements.size());
    }


}
