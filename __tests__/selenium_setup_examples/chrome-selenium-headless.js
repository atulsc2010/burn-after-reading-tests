// solution for headless chrome came form https://stackoverflow.com/a/48677891

import { Builder, By, Key, until, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const screen = {
  width: 640,
  height: 480
};
 
( async function example() {
  const serviceBuilder = new chrome.ServiceBuilder('C:\\Program Files (x86)\\Selenium\\ChromeDriver\\chromedriver.exe');
  // const chromeCapabilities = Capabilities.chrome();
  // chromeCapabilities.set('chromeOptions', {args: ['--headless']});

    let browser = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless().windowSize(screen))  
      //.withCapabilities(chromeCapabilities)
      .setChromeService(serviceBuilder)
      .build();

    try {
        // Navigate to Url
        await browser.get('https://www.google.com');

        // Enter text "cheese" and perform keyboard action "Enter"
        await browser.findElement(By.name('q')).sendKeys('cheese', Key.ENTER);

        let firstResult = await browser.wait(until.elementLocated(By.css('h3')), 10000);

        console.log(await firstResult.getAttribute('textContent'));
    }
    finally{
        await browser.quit();
    }
})();
  
  