package runner;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.events.EventFiringDecorator;
import org.openqa.selenium.support.events.WebDriverListener;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;
import utils.EventHandler;

public class TestSample {

    public static WebDriver driver;

    @Test
    public void testMain() {
        try {
            driver = new RemoteWebDriver(new URL("http://localhost:4444"), new ChromeOptions());

            // maximize browser
            driver.manage().window().maximize();

            // set timeouts
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));

            // add event handler
            WebDriverListener listener = new EventHandler();
            driver = new EventFiringDecorator<>(listener).decorate(driver);

            // open site
            driver.get("https://www.medplusmart.com/");

            // initialize WebDriverWait
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

            WebElement promotions = wait.until(ExpectedConditions.elementToBeClickable(By.linkText("Promotions")));
            promotions.click();

            WebElement quickOrder = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[title='Quick Order']")));
            quickOrder.click();

            WebElement closeBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(@class,'close')]")));
            closeBtn.click();

            driver.findElement(By.xpath("//span[@class='user-name' and text()='Login / Sign up']")).click();


        } catch (MalformedURLException e) {
            e.printStackTrace();
        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }
}

medplus
https://www.medplusmart.com/promotions
