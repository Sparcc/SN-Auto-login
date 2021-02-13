const { Builder, By, Key, until } = require("selenium-webdriver");

const fs = require("fs");
const { Options } = require("selenium-webdriver/chrome");

// Login details file name is "./login-details.json"
// Login details format:
/*  [
      {
        "instance_hostname" : "https://devXXXXXX.service-now.com",
        "username": "XXXXXXXXXXXX",
        "password": "XXXXXXXXXXXXXX"
      },
      {
        "instance_hostname" : "https://devXXXXXX.service-now.com",
        "username": "XXXXXXXXXXXX",
        "password": "XXXXXXXXXXXXXX"
      }
    ]
  */
fs.readFile("./login-details.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let loginDetailsList = JSON.parse(data);
  let options = new Options();
  options.headless();
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  (function runAutomationAsync() {
    runAutomation(loginDetailsList,options);
  })();
});

async function runAutomation(loginDetailsList, options) {
  try {
    loginDetailsList.forEach(async (loginDetails) => {
      let driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
      await driver.get(loginDetails.instance_hostname + "/login.do");
      await driver.wait(until.titleIs("ServiceNow"), 10000);
      await driver
        .findElement(By.id("user_name"))
        .sendKeys(loginDetails.username);
      await driver
        .findElement(By.id("user_password"))
        .sendKeys(loginDetails.password);
      await driver.findElement(By.id("sysverb_login")).click();
    });
  } finally {
    driver.quit();
  }
}
