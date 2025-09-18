TestNG
package runner;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.events.EventFiringDecorator;
import org.openqa.selenium.support.events.WebDriverListener;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.testng.annotations.AfterMethod;
import utils.EventHandler;

public class TestSpice {
    public static WebDriver driver;

    @BeforeMethod
    public void openBrowser() throws MalformedURLException {
        ChromeOptions options = new ChromeOptions();
        driver = new RemoteWebDriver(new URL("http://localhost:4444/"), options);

        WebDriverListener listener = new EventHandler();
        driver = new EventFiringDecorator<>(listener).decorate(driver);

        driver.manage().window().maximize();
        driver.get("https://www.spicejet.com/");
    }

    @Test
    public void testSignupWindowHandling() 
    {
        try 
        {
            WebDriverWait wait=new WebDriverWait(driver, Duration.ofSeconds(15));
            WebElement signupButton=wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[text()='Signup']")));
            signupButton.click();
            wait.until(d->d.getWindowHandles().size() > 1);
            String parentWindow=driver.getWindowHandle();
            Set<String> allWindows =driver.getWindowHandles();
            List<String> windowsList=new ArrayList<>(allWindows);
            String childWindow=null;
            for (String window : windowsList) 
            {
                if (!window.equals(parentWindow)) 
                {
                    childWindow=window;
                    break;
                }
            }
            if (childWindow != null) 
            {
                driver.switchTo().window(childWindow);
                String expectedTitle = "SpiceClub - The Frequent flyer program of Spicejet";
                String actualTitle = driver.getTitle();
                if (actualTitle.equals(expectedTitle)) 
                {
                    System.out.println("Title verification passed: "+actualTitle);
                } 
                else 
                {
                    System.out.println("Title verification failed. Actual title: "+actualTitle);
                }
                driver.close(); 
                driver.switchTo().window(parentWindow);
            } 
            else 
            {
                System.out.println("Child window not found.");
            }

        } 
        catch (Exception e) 
        {
            e.printStackTrace();
        }
    }
    @AfterMethod
    public void closeBrowser() 
    {
        if (driver != null) {
            driver.quit();
        }
    }
}

TestRunner.java


package runner;

import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;

import utils.Base;
import utils.ExcelReader;
import utils.Reporter;
import utils.Screenshot;
import utils.WebDriverHelper;

public class TestRunner extends Base {

    public WebDriverHelper helper;
    public String path="testdata/Testdata.xlsx";
    public String name="Sheet1";
    public Screenshot screenshot;
    public ExtentTest test;
    public ExtentReports extentReports;

    @BeforeMethod
    public void launchBrowser() {
        openBrowser();
        helper=new WebDriverHelper(driver);
        extentReports=Reporter.generateExtentReport("MyTestReport");
    }
    @Test
    public void testOne() throws Exception {
        test=extentReports.createTest("New-test");
        String email=ExcelReader.readdata(path, name, 0, 0);
        String pass=ExcelReader.readdata(path,name,1,0);

        helper.clickOnElement(By.xpath("//a[text()='Login']"));

        helper.clickOnElement(By.xpath("//input[@type='email']"));

        helper.sendKeys(By.xpath("//input[@type='email']"), email);

        helper.clickOnElement(By.xpath("//input[@type='password']"));

        helper.sendKeys(By.xpath("//input[@type='password']"), pass);

        helper.clickOnElement(By.xpath("//button[text()='Login']"));

        Screenshot.getScreenShot(driver, "image");

        Reporter.attachScreenshotToReport(test,driver,"image1");

    }
    @AfterMethod
    public void tearDown() {
        driver.quit();
        extentReports.flush();
    }
}


Base.java


package utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.util.Properties;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.events.EventFiringDecorator;
import org.openqa.selenium.support.events.WebDriverListener;

public class Base {

    public static WebDriver driver;
    public static FileInputStream file;
    public static Properties prop;

    public void loadProperties() throws IOException {
        String propertiesPath = System.getProperty("user.dir") + "/config/browser.properties";
        try {
            file = new FileInputStream(propertiesPath);
            prop = new Properties();
            prop.load(file);

        } catch (FileNotFoundException e) {
            e.printStackTrace();

        }
    }

    public void openBrowser() {

        try {
            loadProperties();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        String executionType = prop.getProperty("executiontype");
        String browserName = prop.getProperty("browser");

        if ("remote".equalsIgnoreCase(executionType)) {
            URL gridUrl;
            try {
                gridUrl = new URL(prop.getProperty("gridurl"));
                driver = new RemoteWebDriver(gridUrl, new ChromeOptions());
            } catch (MalformedURLException e) {

                e.printStackTrace();
            }

        } else if ("local".equalsIgnoreCase(executionType)) {
            switch (browserName.toLowerCase()) {
                case "chrome":
                    driver = new ChromeDriver();
                    break;

                case "edge":
                    driver = new EdgeDriver();
                    break;

                case "firefox":
                    driver = new FirefoxDriver();
                    break;

                default:
                    System.err.println("Unsupported browser: " + browserName);
                    break;
            }
        } else {
            System.err.println("Invalid execution type: " + executionType);
        }

        if (driver != null)

        {
            driver.manage().window().maximize();
            driver.get(prop.getProperty("url"));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(8));
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(8));

        }
        // Dont remove the listener Object

        WebDriverListener listener = new EventHandler();
        driver = new EventFiringDecorator<>(listener).decorate(driver);

    }
}


log report found

log4j.appender.RollingAppender.File=logs/default.log 


