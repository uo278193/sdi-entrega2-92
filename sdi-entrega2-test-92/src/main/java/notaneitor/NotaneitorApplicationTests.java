package notaneitor;

import notaneitor.pageobjects.*;
import notaneitor.util.MongoUtils;
import notaneitor.util.SeleniumUtils;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.springframework.boot.test.context.SpringBootTest;


import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;


//Ordenamos las pruebas por la anotación @Order de cada método
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class NotaneitorApplicationTests {
    //Para MACOSX
    //static String PathFirefox = "/Applications/Firefox 2.app/Contents/MacOS/firefox-bin";
    //static String Geckodriver = "/Users/delacal/selenium/geckodriver-v0.30.0-macos";
    //Para Windows
    //static String Geckodriver = "C:\\Users\\david\\OneDrive\\Documentos\\SDI21-22\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";
    static String PathFirefox = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
    // Rosa
  //  static String Geckodriver = "C:\\Users\\rosa_\\Documents\\Uni\\3º\\Segundo cuatri\\SDI\\Lab\\sesion05\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";
    // David
    //static String Geckodriver = "C:\\Users\\david\\OneDrive\\Documentos\\SDI21-22\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";
    //Mateo
//    static String Geckodriver ="C:\\Users\\User\\Desktop\\TERCERO\\SDI\\sesion06\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";
    // Geckodriver María
    static String Geckodriver = "C:\\Program Files\\geckodriver-v0.30.0-win64.exe";
    //Miguel
    //static String Geckodriver ="C:\\Users\\migue\\OneDrive\\Documentos\\Uniovi\\Tercero segundo cuatri\\SDI\\Practica\\geckodriver-v0.30.0-win64.exe";

    //Común a Windows y a MACOSX
    static final String URL = "http://localhost:8081";
    static WebDriver driver = getDriver(PathFirefox, Geckodriver);
    static MongoUtils mongo= new MongoUtils();

    public static WebDriver getDriver(String PathFirefox, String Geckodriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckodriver);
        driver = new FirefoxDriver();
        return driver;
    }

    //Antes de la primera prueba
    @BeforeAll
    static public void begin() {

    }

    //Al finalizar la última prueba
    @AfterAll
    static public void end() {
        //Borramos la amistad entre estos 2 usuarios para que vuelvan a ejecutarese los tests correctamente
        mongo.deleteFriendship("user11@email.com","user09@email.com");
        //Cerramos el navegador al finalizar las pruebas
        //driver.quit();
    }

    //Antes de cada prueba se navega al URL home de la aplicación
    @BeforeEach
    public void setUp() {
        driver.navigate().to(URL);
    }

    //Después de cada prueba se borran las cookies del navegador
    @AfterEach
    public void tearDown() {
        //driver.manage().deleteAllCookies();
        //driver.close();
    }
    //PR01. Prueba del formulario de registro. registro con datos correctos
    @Test
    @Order(38)
    void PR01() {
        //Vamos al formulario de registro
        PO_HomeView.clickOption(driver, "signup", "class", "btn btn-primary");
        //Rellenamos el formulario.
        PO_SignUpView.fillForm(driver, "prueba1@email.com", "Josefo", "Perez", "77777", "77777");
        //Comprobamos que se notifica el registro.
        String checkText = "Nuevo usuario registrado.";
        List<WebElement> result = PO_View.checkElementBy(driver, "class", "alert alert-info");
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    //PR02. Prueba del formulario de registro. Campos vacíos
    // Propiedad: Error.xxx.empty
    @Test
    @Order(2)
    void PR02() {
        PO_HomeView.clickOption(driver, "signup", "class", "btn btn-primary");
        PO_SignUpView.fillForm(driver, "", "", "", "77777", "77777");
        // En este caso, comprobamos que no se ha registrado el usuario y no se redirige a otra página;
        // ya que los campos son requeridos
        String checkText = "";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "nombre");
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    //PR03. Prueba del formulario de registro. Repetición de contraseña inválida.
    // Propiedad: Error.signup.passwordConfirm.coincidence
    @Test
    @Order(3)
    void PR03() {
        PO_HomeView.clickOption(driver, "signup", "class", "btn btn-primary");
        PO_SignUpView.fillForm(driver, "jose@email.com", "Jose", "Perez", "77777", "44444");
        //Comprobamos el error de contraseña repetida inválida
        String checkText = "Las contraseñas no coinciden";
        List<WebElement> result = PO_View.checkElementBy(driver, "class", "alert alert-danger");
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    //PR04. Prueba del formulario de registro. Email existente.
    // Propiedad: Error.signup.email.duplicate
    @Test
    @Order(4)
    public void PR04() {
        PO_HomeView.clickOption(driver, "signup", "class", "btn btn-primary");
        PO_SignUpView.fillForm(driver, "user01@email.com", "Pedro", "Lopez", "77777", "77777");
        //Comprobamos el error de email duplicado.
        String checkText = "Este email ya está en uso";
        List<WebElement> result = PO_View.checkElementBy(driver, "class", "alert alert-danger");
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    // Identificación válida con usuario de ROL Administrador (admin@email.com/admin)
    @Test
    @Order(5)
    public void PR05() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");
        //Comprobamos que puede ver los usuarios
        String checkText = "Usuarios";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "users");
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    // Identificación válida con usuario de ROL usuario (user01@email.com/user01)
    @Test
    @Order(6)
    public void PR06() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Comprobamos que podemos ver sus amigos
        String checkText = "Amigos";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "friends");
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    // Inicio de sesión con datos inválidos (usuario estándar, campo email y contraseña vacíos).
    @Test
    @Order(7)
    public void PR07() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "", "");
        //Comprobamos que no se ha iniciado sesión
        String checkText = "Identificación de usuario";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    // Inicio de sesión con datos inválidos
    // (usuario estándar, email existente, pero contraseña incorrecta)
    @Test
    @Order(8)
    public void PR08() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "22222");
        //Comprobamos que no se ha iniciado sesión
        String checkText = "Identificación de usuario";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    // Hacer clic en la opción de salir de sesión y comprobar que se redirige a la página de inicio de sesión (Login).
    @Test
    @Order(9)
    public void PR09() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Se comprueba que ha hecho login
        String checkText = "Usuarios";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idUsuariosListaUser");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //Se desconecta de la sesión
        PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");
        //Comprobamos que se ha desconectado
        String checkText2 = "Identifícate";
        List<WebElement> result2 = PO_View.checkElementBy(driver, "text", checkText2);
        Assertions.assertEquals(checkText2, result2.get(0).getText());
    }

    //Comprobar que el botón cerrar sesión no está visible si el usuario no está autenticado.
    @Test
    @Order(10)
    public void PR10() {
        // Comprobamos que no aparece la opción al entrar en la página
        String checkText = "Desconectar";
        try {
            PO_View.checkElementBy(driver, "text", checkText);
        } catch (org.openqa.selenium.TimeoutException e) {
            Assertions.assertEquals(e.getMessage(), "Expected condition failed: waiting for visibility of element " +
                    "located by By.xpath: //*[contains(text(),'Desconectar')] (tried for 2 second(s) with 500 milliseconds interval)");
        }
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Se comprueba que aparece la opción de desconectarse
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    //Mostrar el listado de usuarios y comprobar que se muestran todos los que existen en el sistema.
    @Test
    @Order(1)
    public void PR11() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");
        //Comprobamos que puede ver los usuarios
        String checkText = "Usuarios";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idTitleAdminListUser");
        Assertions.assertEquals(checkText, result.get(0).getText());
        Assertions.assertTrue(PO_AdminUsersListView.countUsers(driver) > 0);
    }

    // Borrado del primer usuario de la lista
    @Test
    @Order(35)
    public void PR12() {
        //Se entra en la aplicación con rol de Administrador
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");
        // Guardamos el número de usuarios actual y el primer usuario
        int usersBefore = PO_AdminUsersListView.countUsers(driver);
        WebElement userToRemove = PO_AdminUsersListView.getUser(driver,0);
        // Se selecciona el primer checkBox
        List<Integer> positions = new ArrayList<>();
        positions.add(0);
        PO_AdminUsersListView.markCheckBoxElements(driver,positions);
        // Se pulsa el botón eliminar
        PO_AdminUsersListView.clickBtn(driver);
        // Se comprueba que el tamaño de la lista es un elemento menor
        int usersAfter = PO_AdminUsersListView.countUsers(driver);
        Assertions.assertEquals(usersAfter, (usersBefore-1));
        // y que el usuario ya no está en la lista
        Assertions.assertFalse(PO_AdminUsersListView.checkUserInList(driver, userToRemove));
    }

    // Borrado del último usuario de la lista
    @Test
    @Order(36)
    public void PR13() {
        //Se entra en la aplicación con rol de Administrador
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");
        // Guardamos el número de usuarios actual y el último usuario
        int usersBefore = PO_AdminUsersListView.countUsers(driver);
        WebElement userToRemove = PO_AdminUsersListView.getUser(driver,usersBefore-1);
        // Se selecciona el último checkBox
        List<Integer> positions = new ArrayList<>();
        positions.add(usersBefore-1);
        PO_AdminUsersListView.markCheckBoxElements(driver,positions);
        // Se pulsa el botón eliminar
        PO_AdminUsersListView.clickBtn(driver);
        // Se comprueba que el tamaño de la lista es un elemento menor
        int usersAfter = PO_AdminUsersListView.countUsers(driver);
        Assertions.assertEquals(usersAfter, (usersBefore-1));
        // y que el usuario ya no está en la lista
        Assertions.assertFalse(PO_AdminUsersListView.checkUserInList(driver, userToRemove));
    }

    // Borrado de 3 usuarios de la lista
    @Test
    @Order(37)
    public void PR14() {
        //Se entra en la aplicación con rol de Administrador
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");
        // Guardamos el número de usuarios actual y los 3 usuarios a borrar (posiciones 0, 2 y 3)
        int usersBefore = PO_AdminUsersListView.countUsers(driver);
        WebElement user1ToRemove = PO_AdminUsersListView.getUser(driver,0);
        WebElement user2ToRemove = PO_AdminUsersListView.getUser(driver,2);
        WebElement user3ToRemove = PO_AdminUsersListView.getUser(driver,3);
        // Se selecciona el último checkBox
        List<Integer> positions = new ArrayList<>();
        positions.add(0);
        positions.add(2);
        positions.add(3);
        PO_AdminUsersListView.markCheckBoxElements(driver,positions);
        // Se pulsa el botón eliminar
        PO_AdminUsersListView.clickBtn(driver);
        // Se comprueba que el tamaño de la lista es un elemento menor
        int usersAfter = PO_AdminUsersListView.countUsers(driver);
        Assertions.assertEquals(usersAfter, (usersBefore-3));
        // y que el usuario ya no está en la lista
        Assertions.assertFalse(PO_AdminUsersListView.checkUserInList(driver, user1ToRemove));
        Assertions.assertFalse(PO_AdminUsersListView.checkUserInList(driver, user2ToRemove));
        Assertions.assertFalse(PO_AdminUsersListView.checkUserInList(driver, user3ToRemove));
    }

    @Test
    @Order(15)
    public void PR15() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Se comprueba que ha hecho login
        String checkText = "Bienvenido: user01@email.com";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idInicio");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //Hacemos click en el listado de usuarios
        PO_HomeView.clickOption(driver, "/users/list", "id", "users");
        // Comprobamos todos los usuarios
        PO_PrivateView.checkUser(driver, "user02@email.com");
        PO_PrivateView.checkUser(driver, "user03@email.com");
        PO_PrivateView.checkUser(driver, "user04@email.com");
        PO_PrivateView.checkUser(driver, "user05@email.com");
        PO_PrivateView.checkUser(driver, "user06@email.com");
    }
    // Envía una invitación de amistad a un usuario
    @Test
    @Order(19)
    public void PR19() {
        // Se entra en la aplicación como usuario1 (ROL --> Usuario)
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillLoginForm(driver, "user11@email.com", "user11");
        // Se va a la pestaña de listado de usuarios
        PO_HomeView.clickOption(driver, "/users/list", "id", "users");
        // Enviamos petición al primer usuario de la lista
        PO_PrivateView.goToNextPage(driver,"2");
        PO_PrivateView.clickElement(driver,3);
        // Nos desconectamos y conectamos con el usuario 05 que es al que hemos enviado la solicitud
        // PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillLoginForm(driver, "user09@email.com", "user09");
        // Vamos a la vista de lista de solicitudes de amistad
        PO_HomeView.clickOption(driver, "/user/friendRequests", "id", "friendRequests");
        // Comprobamos que aparece el usuario 1
        PO_PrivateView.checkUser(driver,"user11");
    }

    // Enviar una petición de amistad a un usuario al que ya le habíamos mandado la petición previamente
    @Test
    @Order(20)
    public void PR20() {
        // Se entra en la aplicación como usuario11 (ROL --> Usuario)
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillLoginForm(driver, "user11@email.com", "user11");
        // Se va a la pestaña de listado de usuarios
        PO_HomeView.clickOption(driver, "/users/list", "id", "users");

        // El usuario 9 ya ha recibido una petición de amistad del usuario 11, por lo que el botón no debe estar visible
        //      la fila tendrá solo 3 columnas en lugar de 4
        PO_PrivateView.goToNextPage(driver,"2");
        int columns = SeleniumUtils.waitLoadElementsBy(driver, "free", "//*[@id=\"tableShowUsers\"]/tbody/tr[4]/td", PO_View.getTimeout()).size();
        Assertions.assertEquals(columns, 3);

    }

    @Test
    @Order(16)
    public void PR16() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Se comprueba que ha hecho login
        String checkText = "Bienvenido: user01@email.com";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idInicio");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //Hacemos click en el listado de usuarios
        PO_HomeView.clickOption(driver, "/users/list", "id", "users");

        // Estando en el menu buscamos sin rellenar el campo de texto
        PO_SearchView.fillForm(driver,"");

        //Comprobacion pagina 1 5 elementos
        List<WebElement> page1 =  SeleniumUtils.waitLoadElementsBy(driver,"free", "//tbody/tr",PO_View.getTimeout());
        assertTrue(page1.size()== 5);

        //Comprobacion pagina 2 5 elementos
        PO_PrivateView.goToNextPage(driver,"2");
        List<WebElement> page2 =  SeleniumUtils.waitLoadElementsBy(driver,"free", "//tbody/tr",PO_View.getTimeout());
        assertTrue(page2.size()== 5);

        PO_PrivateView.goToNextPage(driver,"3");
        //Comprobacion pagina 3 4 elementos
        List<WebElement> page3 =  SeleniumUtils.waitLoadElementsBy(driver,"free", "//tbody/tr",PO_View.getTimeout());
        assertTrue(page3.size()== 4);

    }

    @Test
    @Order(17)
    public void PR17() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Se comprueba que ha hecho login
        String checkText = "Bienvenido: user01@email.com";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idInicio");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //Hacemos click en el listado de usuarios
        PO_HomeView.clickOption(driver, "/users/list", "id", "users");

        // Estando en el menu buscamos sin rellenar el campo de texto
        PO_SearchView.fillForm(driver,"admin");

        //Comprobacion pagina 1 0 elementos
        SeleniumUtils.waitTextIsNotPresentOnPage(driver,"user",PO_View.getTimeout());
    }

    @Test
    @Order(18)
    public void PR18() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Se comprueba que ha hecho login
        String checkText = "Bienvenido: user01@email.com";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idInicio");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //Hacemos click en el listado de usuarios
        PO_HomeView.clickOption(driver, "/users/list", "id", "users");

       //Rellenamos con user05 y debería salirnos solo 1 usuario
        PO_SearchView.fillForm(driver,"user05");

        //Comprobacion pagina 1 1 elementos
        List<WebElement> page1 =  SeleniumUtils.waitLoadElementsBy(driver,"free", "//tbody/tr",PO_View.getTimeout());
        assertTrue(page1.size()== 1);
    }

    //Mostrar el listado de invitaciones de amistad recibidas. Comprobar con un listado que
    //contenga varias invitaciones recibidas
    @Test
    @Order(21)
    public void PR21() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user09@email.com", "user09");
        //Se comprueba que ha hecho login
        String checkText = "Bienvenido: user09@email.com";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idInicio");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //vamos al apartado de friendRequests
        PO_HomeView.clickOption(driver, "/user/friendRequests", "id", "friendRequests");
        //user09 tiene invitaciones de user10 y user11
        PO_PrivateView.checkUser(driver, "user10");
        PO_PrivateView.checkUser(driver, "user11");
    }

    //Sobre el listado de invitaciones recibidas. Hacer clic en el botón/enlace de una de ellas y
    //comprobar que dicha solicitud desaparece del listado de invitaciones.
    @Test
    @Order(22)
    public void PR22() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user09@email.com", "user09");
        //Se comprueba que ha hecho login
        String checkText = "Bienvenido: user09@email.com";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idInicio");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //vamos al apartado de friendRequests
        PO_HomeView.clickOption(driver, "/user/friendRequests", "id", "friendRequests");
        //user09 tiene 2 invitaciones
        PO_FriendRequestView.checkNumberOfFriendRequest(driver,2);
        //Aceptamos una de ellas
        PO_FriendRequestView.clickAcceptFriendRequest(driver, "//*[@id=\"idTablaListaPeticionesAmistad\"]/tbody/tr[2]/td[3]/form", "id", "idTituloPeticionesAmistadListaUser");
        //Comprobamos que ahora solo hay una
        driver.navigate().refresh();
        PO_FriendRequestView.checkNumberOfFriendRequest(driver,1);
    }

    // Mostrar el listado de amigos de un usuario. Comprobar que el listado contiene los amigos que deben ser.
    @Test
    @Order(23)
    public void PR23() {
        // User09 en este punto tendra un amigo user11
        PO_FriendsView.goToFriendsList(driver, "user09@email.com", "user09");
        //Encontramos el usuario user11
        PO_PrivateView.checkUser(driver, "user11@email.com");
    }

    // Agregar Post Bien
    @Test
    @Order(24)
    public void PR24() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user07@email.com", "user07");
        //Se comprueba que ha hecho login
       /* String checkText = "Usuarios";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idUsuariosListaUser");
        Assertions.assertEquals(checkText, result.get(0).getText());
        */
        //vamos a mis post y los contamos
        List<WebElement> elements1 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'myPosts')]");
        elements1.get(0).click();
        List<WebElement> myPosts = SeleniumUtils.waitLoadElementsBy(driver, "free", "//div//div/a", PO_View.getTimeout());
        int sizeOriginal = myPosts.size();
        driver.navigate().to(URL + "");
        //vamos a la pagina de añadir post
        List<WebElement> elements2 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'addPosts')]");
        elements2.get(0).click();
        //rellenamos el formulario de post
        PO_PostView.fillForm(driver, "test24", "test24");
        //vamos a la pagina con las publicaciones

        //vamos a mis post y los contamos
        List<WebElement> elements3 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'myPosts')]");
        elements3.get(0).click();
        List<WebElement> myPosts2 = SeleniumUtils.waitLoadElementsBy(driver, "free", "//div//div/a", PO_View.getTimeout());
        int sizeDespues = myPosts2.size();


        //Comprobamos q hay uno mas
        Assertions.assertEquals(sizeOriginal + 1, sizeDespues);

    }

    // Agregar Campo vacio
    @Test
    @Order(25)
    public void PR25() {


        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user07@email.com", "user07");
        //Se comprueba que ha hecho login
       /* String checkText = "Usuarios";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idUsuariosListaUser");
        Assertions.assertEquals(checkText, result.get(0).getText());
        */
        //vamos a mis post y los contamos
        List<WebElement> elements1 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'myPosts')]");
        elements1.get(0).click();
        List<WebElement> myPosts = SeleniumUtils.waitLoadElementsBy(driver, "free", "//div//div/a", PO_View.getTimeout());
        int sizeOriginal = myPosts.size();
        driver.navigate().to(URL + "");
        //vamos a la pagina de añadir post
        List<WebElement> elements2 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'addPosts')]");
        elements2.get(0).click();
        //rellenamos el formulario de post
        PO_PostView.fillForm(driver, "", "test24");
        //vamos a la pagina con las publicaciones

        //vamos a mis post y los contamos
        List<WebElement> elements3 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'myPosts')]");
        elements3.get(0).click();
        List<WebElement> myPosts2 = SeleniumUtils.waitLoadElementsBy(driver, "free", "//div//div/a", PO_View.getTimeout());
        int sizeDespues = myPosts2.size();


        //Comprobamos q no se añadio ningun post
        Assertions.assertEquals(sizeOriginal , sizeDespues);


    }
    @Test
    @Order(26)
    public void PR26() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user07@email.com", "user07");


        //vamos a mis post y los contamos
        List<WebElement> elements3 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'myPosts')]");
        elements3.get(0).click();
        List<WebElement> myPosts2 = SeleniumUtils.waitLoadElementsBy(driver, "free", "//div//div/a", PO_View.getTimeout());
        int sizeDespues = myPosts2.size();


        //Comprobamos q no se añadio ningun post
        Assertions.assertEquals(2 , sizeDespues);

    }




    @Test
    @Order(27)
    public void PR27() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user08@email.com", "user08");


        //vamos a mis post y los contamos
        List<WebElement> elements3 =  PO_View.checkElementBy(driver, "free",  "//li[contains(@id,'friends')]");
        elements3.get(0).click();


        PO_View.checkElementBy(driver,"id","linkNombre").get(0).click();
        List<WebElement> myPosts2 = SeleniumUtils.waitLoadElementsBy(driver, "free", "//div//div/a", PO_View.getTimeout());
        int sizeDespues = myPosts2.size();
        //Comprobamos q no se añadio ningun post
        Assertions.assertEquals(2 , sizeDespues);

    }

    @Test
    @Order(28)
    public void PR28() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, "user01@email.com", "user01");
        //Se comprueba que ha hecho login
        String checkText = "Usuarios";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idUsuariosListaUser");
        Assertions.assertEquals(checkText, result.get(0).getText());
        //Escribimos en la url el id de un usuario no amigo del user01
        driver.navigate().to("http://localhost:8090/post/friends/10");
        //Comprobamos que nos devuelve a la vista de amigos
        checkText = "Tus amigos";
        result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }


    @Test
    @Order(30)
    public void PR29() {
        //Escribimos la url en la página sin estar autenticados para listar usuarios
        driver.navigate().to("http://localhost:8081/admin/users");
        //Comprobamos que estamos en el formulario de login
        String checkText = "Identificacion de usuario";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

    }

    @Test
    @Order(31)
    public void PR30() {
        //Escribimos la url en la página sin estar autenticados para listar invitaciones de amistad
        driver.navigate().to("http://localhost:8081/user/friendRequests");
        //Comprobamos que estamos en el formulario de login
        String checkText = "Identificacion de usuario";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

    }

    @Test
    @Order(32)
    public void PR31() {
        /*
            Este punto no hemos podido comprobarlo ya que un usuario tan solo puede acceder a su propio listado de amigos.
            La ruta que muestra los amigos de un usuario es /user/friends y no /user/friends/:id. El listado se muestra siempre
            de los amigos del usuario en sesión por lo que no podrá acceder ningún usuario a un listado que no sea el suyo.

            Como comprobación adicional, probaremos que un usuario no logeado no puede acceder al listado de amigos
         */
        driver.navigate().to("http://localhost:8081/user/friends");
        //Comprobamos que estamos en el formulario de login
        String checkText = "Identificacion de usuario";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

    }

    @Test
    @Order(33)
    public void PR33() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        // Conexiones erronea
        PO_LoginView.fillLoginForm(driver, "admi@email.com", "admin");
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "dmin");

        // REGISTRO DE USUARIOS NUEVOS
        //Vamos al formulario de registro
        PO_HomeView.clickOption(driver, "signup", "class", "btn btn-primary");
        //Rellenamos el formulario.
        PO_SignUpView.fillForm(driver, "prueba1", "Josefo", "Perez", "77777", "77777");
        //Logout
        PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");

        //Vamos al formulario de registro
        PO_HomeView.clickOption(driver, "signup", "class", "btn btn-primary");
        //Rellenamos el formulario.
        PO_SignUpView.fillForm(driver, "prueba2", "Antonio", "Perez", "123456", "123456");
        //Logout
        PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");

        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Conexion exitosa
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");
        //Logout
        PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");

        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");

        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");

        PO_NavView.adminDropdown(driver, "btnViewLogs");

        //Comprobamos las cantidades de los logs que salen de cada tipo
        PO_Logs.checkAtLeastLogType(driver,"PET",2);
        PO_Logs.checkAtLeastLogType(driver,"ALTA",2);
        PO_Logs.checkAtLeastLogType(driver,"LOGIN-EX",2);
        PO_Logs.checkAtLeastLogType(driver,"LOGIN-ERR",2);
        PO_Logs.checkAtLeastLogType(driver,"LOGOUT",3);

    }

    // Estando autenticado como usuario administrador, ir a visualización de logs, pulsar el
    // botón/enlace borrar logs y comprobar que se eliminan los logs de la base de datos.
    @Test
    @Order(34)
    public void PR34() {
        //Vamos al formulario de logueo.
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario como un usuario estandar
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");
        //Comprobamos que puede ver los usuarios
        String checkText = "Usuarios";
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "idTitleAdminListUser");
        Assertions.assertEquals(checkText, result.get(0).getText());
        PO_NavView.adminDropdown(driver,"btnViewLogs");
        //Comprobamos que al menos hay 1 login exitoso (ya que nos logeamos como admin)
        PO_Logs.checkAtLeastLogType(driver,"LOGIN-EX",1);
        PO_NavView.adminDropdown(driver,"btnViewLogs");
        PO_AdminUsersListView.clickBtn(driver);
        //Comprobamos que ahora ya no hay ninguno de ningun tipo
        PO_Logs.checkLogType(driver,"PET",2);
        PO_Logs.checkLogType(driver,"ALTA",0);
        PO_Logs.checkLogType(driver,"LOGIN-EX",0);
        PO_Logs.checkLogType(driver,"LOGIN-ERR",0);
        PO_Logs.checkLogType(driver,"LOGOUT",0);
    }

}
