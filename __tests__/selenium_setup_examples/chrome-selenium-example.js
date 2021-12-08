import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';


( async function example() {
  const serviceBuilder = new chrome.ServiceBuilder('C:\\Program Files (x86)\\Selenium\\ChromeDriver\\chromedriver.exe');

    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(serviceBuilder)
      .build();

    try {
        // Navigate to Url
        await driver.get('https://www.google.com');

        // Enter text "cheese" and perform keyboard action "Enter"
        await driver.findElement(By.name('q')).sendKeys('cheese', Key.ENTER);

        let firstResult = await driver.wait(until.elementLocated(By.css('h3')), 10000);

        console.log(await firstResult.getAttribute('textContent'));
    }
    finally{
        await driver.quit();
    }
})();
  