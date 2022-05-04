package sdistagram.pageobjects;

import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_FriendRequestView extends PO_NavView{

    static public void checkNumberOfFriendRequest(WebDriver driver, int size) {
        List<WebElement> elements = PO_View.checkElementBy(driver, "free", "//a[contains(@href, 'user/friendRequest/accept/')]");
        Assertions.assertEquals(size, elements.size());
    }
}
