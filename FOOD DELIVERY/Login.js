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
    public String path="resources/Testdata.xlsx";
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

        helper.clickOnElement(By.xpath("//input[@type='email']"));

        helper.sendKeys(By.xpath("//input[@type='email']"), email);

        helper.clickOnElement(By.xpath("//input[@type='password']"));

        helper.sendKeys(By.xpath("//input[@type='password']"), pass);

        helper.clickOnElement(By.xpath("//label[text()='Remember me']"));

        helper.clickOnElement(By.xpath("//input[@type='submit']"));

        helper.clickOnElement(By.xpath("//a[@id='forgot_password_link']"));

        Screenshot.getScreenShot(driver, "image");

        Reporter.attachScreenshotToReport(test,driver,"image1");

    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
        extentReports.flush();
    }
}
