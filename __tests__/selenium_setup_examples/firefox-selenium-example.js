import { Builder, By, Key, until } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js';


( async function example() {
  const serviceBuilder = new firefox.ServiceBuilder('C:\\Program Files (x86)\\Selenium\\FirefoxDriver\\geckodriver.exe');
  const options = new firefox.Options();
  options.setBinary('C:\\Program Files\\Mozilla Firefox\\firefox.exe');

    let driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxService(serviceBuilder)
      .setFirefoxOptions(options)
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
  