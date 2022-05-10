package notaneitor.pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_FriendsView extends PO_NavView {

    static public void goToFriendsList(WebDriver driver, String user, String passwd) {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario de logueo
        PO_LoginView.fillLoginForm(driver, user, passwd);
        //Vamos a la vista de la lista de amigos
        List<WebElement> elements = PO_View.checkElementBy(driver, "free", "//a[contains(@href, 'user/friends')]");
        elements.get(0).click();
    }

}
