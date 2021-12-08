import { Builder, By, Key, until } from "selenium-webdriver";
import { openChrome, openFirefox } from "./helpers/init-drivers.js";
import fs from "fs";

// burn after reading page Url- System Under Test
const url = "https://www.altocumulus.it/pages/burn-after-reading/index.html";

//Regex pattern for validating Guids
const guidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

//const browser = openChrome();
const browser = openFirefox();

// Open the Home page
const pageLoad = async () => {
  await browser.get(url);
};

describe("Scenario 1 - Health Check - On initial load check for visual elements.", () => {
  beforeAll(async () => {
    await pageLoad();
  }, 10000);

  afterAll(async () => {
    await browser.sleep(1000);
  }, 15000);

  test("1.1 That the Page title displayed", async () => {
    const title = await browser.findElement(By.css(".sidenav h4")).getText();
    expect(title).toContain("Burn After Reading");
  }, 20000);

  test("1.2 That important form elements on the form are present", async () => {
    const pastebin = await browser.findElement(By.css("#pastebin"));
    const sendBtn = await pastebin.findElement(By.css("#encrypt"));

    expect(await sendBtn.isDisplayed()).toBeTruthy(); // Button exists and displayed
    expect(await sendBtn.isEnabled()).toBeTruthy(); // Button is clickable
    expect(await sendBtn.getText()).toContain("Send Paste");

    const autoSuggestBtn = await pastebin.findElement(
      By.css("button.btn-generate.btn.btn-success")
    );

    expect(await autoSuggestBtn.isDisplayed()).toBeTruthy(); // Button exists and displayed
    expect(await autoSuggestBtn.isEnabled()).toBeTruthy(); // Button is clickable
    expect(await autoSuggestBtn.getText()).toContain("Auto Suggest"); // Button has correct text label
  }, 20000);
});

describe("Scenario 2 - Happy path - send a new encrypted paste.", () => {
  beforeAll(async () => {
    await pageLoad();
  }, 10000);

  afterAll(async () => {
    await browser.sleep(2000);
  }, 15000);

  test("2.1 That sending a paste successfully returns a guid back", async () => {
    const pastebin = await browser.findElement(By.css("#pastebin"));
    const passphrase = await pastebin.findElement(By.css("#passphrase"));
    const paste = await pastebin.findElement(By.css("#paste"));
    const sendBtn = await pastebin.findElement(By.css("#encrypt"));

    expect(await sendBtn.isDisplayed()).toBeTruthy(); // Button exists and displayed

    await passphrase.sendKeys(
      "super secret passphrase that you will never guess"
    );
    await paste.sendKeys(
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse efficitur, magna nec sollicitudin feugiat, urna nibh commodo arcu,
      nec varius dolor lectus vitae turpis. Duis egestas ullamcorper aliquet. Phasellus eu augue ullamcorper, porta lacus vel, aliquet velit.
      Aenean libero lacus, suscipit quis vestibulum ut, porta eget orci. `
    );

    await sendBtn.click();
    await browser.sleep(2000);

    const pasteurl = await browser
      .wait(until.elementLocated(By.css("#pasteurl")), 10000)
      .getText();

    const guid = pasteurl.slice(pasteurl.lastIndexOf("=") + 1);

    expect(pasteurl).toBeTruthy(); // an unique url for the paste is returned
    expect(guid).toMatch(guidPattern); // url contains a valid guid
  }, 20000);
});

describe("Scenario 3 - Happy path - successfully receive the paste back and then decrypt it.", () => {
  const firstTab = browser.getWindowHandle();

  beforeAll(async () => {
    await pageLoad();
  }, 10000);

  afterAll(async () => {
    await browser.sleep(1000);
    await browser.close(); // close the new tab
    await browser.sleep(1000);
    await browser.switchTo().window(firstTab); // Switch back to the first tab
  }, 15000);

  test("3.1 That decrypted text is same as what was originally entered", async () => {
    let pastebin = await browser.findElement(By.css("#pastebin"));
    let passphrase = await pastebin.findElement(By.css("#passphrase"));
    let paste = await pastebin.findElement(By.css("#paste"));
    let sendBtn = await pastebin.findElement(By.css("#encrypt"));

    expect(await sendBtn.isDisplayed()).toBeTruthy(); // Button exists and displayed

    const passphraseText = "super secret passphrase that you will never guess";
    const originalText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse efficitur, magna nec sollicitudin feugiat, urna nibh commodo arcu,
      nec varius dolor lectus vitae turpis. Duis egestas ullamcorper aliquet. Phasellus eu augue ullamcorper, porta lacus vel, aliquet velit.
      Aenean libero lacus, suscipit quis vestibulum ut, porta eget orci. `;

    await passphrase.sendKeys(passphraseText);
    await paste.sendKeys(originalText);
    await sendBtn.click();
    await browser.sleep(2000);

    const pasteurl = await browser
      .wait(until.elementLocated(By.css("#pasteurl")), 10000)
      .getText();
    const guid = pasteurl.slice(pasteurl.lastIndexOf("=") + 1);

    expect(pasteurl).toBeTruthy();
    expect(guid).toMatch(guidPattern);

    await browser.switchTo().newWindow("tab");
    await browser.get(pasteurl);

    //get the elements again on the new tab/window
    pastebin = await browser.findElement(By.css("#pastebin"));
    passphrase = await pastebin.findElement(By.css("#passphrase"));
    paste = await pastebin.findElement(By.css("#paste"));
    sendBtn = await pastebin.findElement(By.css("#encrypt"));

    const decryptBtn = await pastebin.findElement(By.css("#decrypt"));

    expect(await sendBtn.isDisplayed()).toBeFalsy(); // Button is not displayed anymore
    expect(await decryptBtn.isDisplayed()).toBeTruthy(); // Button is not displayed anymore

    await passphrase.sendKeys(passphraseText);
    await decryptBtn.click();
    await browser.sleep(2000);

    //Test that decrypted value is same as what was originally entered
    expect(await paste.getAttribute("value")).toBe(originalText);
  }, 20000);
});

describe("Scenario 4 - Unhappy path - When user submits a blank.", () => {
  beforeAll(async () => {
    await pageLoad();
  }, 10000);

  afterAll(async () => {
    await browser.close();
    await browser.quit();
  }, 15000);

  test("4.1 That when user submits a blank form, an error message is shown", async () => {
    const pastebin = await browser.findElement(By.css("#pastebin"));
    const passphrase = await pastebin.findElement(By.css("#passphrase"));
    const paste = await pastebin.findElement(By.css("#paste"));
    const sendBtn = await pastebin.findElement(By.css("#encrypt"));
    let validationErrors = [];

    expect(await sendBtn.isDisplayed()).toBeTruthy(); // Button exists and displayed

    //catch the first error message
    await sendBtn.click(); // Submit form
    await browser.sleep(300);
    const screen1 = await browser.takeScreenshot();
    validationErrors = await browser.findElements(
      By.css("*:required:invalid") // combined CSS selector for "input:required:invalid" and "textarea:required:invalid"
    );

    expect(validationErrors.length).toBeGreaterThan(0);

    await browser.sleep(300);
    await passphrase.sendKeys("This is my passphrase ");
    await browser.sleep(500);

    //catch the second error
    await sendBtn.click();
    const screen2 = await browser.takeScreenshot();
    //await browser.sleep(300);
    validationErrors = await browser.findElements(By.css("*:required:invalid"));

    expect(validationErrors.length).toBeGreaterThan(0);

    await browser.sleep(2000);
    // No more errors
    paste.sendKeys("This is my text to be sent to pastebin");
    await sendBtn.click();
    const screen3 = await browser.takeScreenshot();
    validationErrors = await pastebin.findElements(
      By.css("*:required:invalid")
    );

    expect(validationErrors.length).toBe(0);

    //Save all screenshots
    await fs.writeFileSync(
      `./screenshots/test3-screen1${Date.now()}.png`,
      screen1,
      "base64"
    );

    await fs.writeFileSync(
      `./screenshots/test3-screen2${Date.now()}.png`,
      screen2,
      "base64"
    );

    await fs.writeFileSync(
      `./screenshots/test3-screen3${Date.now()}.png`,
      screen3,
      "base64"
    );
  }, 20000);
});
