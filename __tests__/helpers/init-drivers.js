import { Builder } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";

export const openChrome = () => {
  //Start a Chrome browser session
  const driver = new Builder()
    .forBrowser("chrome")
    //.setChromeOptions(new chrome.Options().headless())
    .build();

  return driver;
};

export const openFirefox = () => {
  const serviceBuilder = new firefox.ServiceBuilder(
    "C:\\Program Files (x86)\\Selenium\\FirefoxDriver\\geckodriver.exe"
  );
  const options = new firefox.Options();
  options.setBinary("C:\\Program Files\\Mozilla Firefox\\firefox.exe");

  let driver = new Builder()
    .forBrowser("firefox")
    .setFirefoxService(serviceBuilder)
    .setFirefoxOptions(options)
    .build();

  return driver;
};
