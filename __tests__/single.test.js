const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const script = require('jest');
const fs = require('fs');

const url = 'https://www.selenium.dev/'
 
const getElementXpath = async (browser, xpath, timeout = 3000) => {
  const el = await browser.wait(until.elementLocated(By.xpath(xpath)), timeout);
  return await browser.wait(until.elementIsVisible(el), timeout);
};
 
const getElementName = async (browser, name, timeout = 3000) => {
  const el = await browser.wait(until.elementLocated(By.name(name)), timeout);
  return await browser.wait(until.elementIsVisible(el), timeout);
};
 
const getElementId = async (browser, id, timeout = 3000) => {
  const el = await browser.wait(until.elementLocated(By.id(id)), timeout);
  return await browser.wait(until.elementIsVisible(el), timeout);
};
 
// declaring the test group  This is our test case scenario that we will execute from our first test script. 
describe('executing test scenario on the website www.selenium.dev', () => {
    
    const browser = new Builder()
    .forBrowser('chrome')
    //.setChromeOptions(new chrome.Options().headless())
    .build();
  
  beforeAll( async() => {  
     await browser.get('https://www.selenium.dev',);
  }, 10000);
 
  afterAll(async () => {
    await browser.quit();
  }, 15000);
  
  test('it performs a validation of title on the home page', async () => {
    await browser.get(url)
    const title = await browser.findElement(By.css('h1')).getText()
    expect(title).toContain('Selenium automates browsers')
  })
 
  test('it performs a validation of the search box on the page', async () => {
    const foundAndLoadedCheck = async () => {
      await until.elementLocated(By.className('td-search-input'))
      const value = await browser.findElement(By.className('td-search-input')).getText()
      return value !== '~'
    }
 
    await browser.wait(foundAndLoadedCheck, 3000)
    const search = await browser.findElement(By.className('td-search-input')).getText()
    expect(search).toEqual('')
  })
 
// declaring the test group
 
  describe('it captures a screenshot of the current page on the browser', () => {
    test('snap a picture by taking the screenshot', async () => {
      // files saved in ./reports/screenshots by default
      await browser.get(url)
      let encoded = await browser.takeScreenshot()
      await fs.writeFileSync(`./screenshots/image${Date.now()}.png`, encoded, 'base64');
    })
  })
});

