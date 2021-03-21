const { Builder, By, Key, until } = require("selenium-webdriver");

const fs = require("fs");
const { Options } = require("selenium-webdriver/chrome");
const { exit } = require("process");

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
    runAutomation(loginDetailsList, options);
  })();
});

async function runAutomation(loginDetailsList, options) {
  loginDetailsList.forEach(async (loginDetails) => {
    let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
    try {
      await driver.get(loginDetails.instance_hostname + "/login.do");
      await driver.wait(
          until.elementLocated(
            By.id("user_name")
          )
        , 10000);
      await driver
        .findElement(By.id("user_name"))
        .sendKeys(loginDetails.username);
      await driver
        .findElement(By.id("user_password"))
        .sendKeys(loginDetails.password);
      await driver.findElement(By.id("sysverb_login")).click();
     await driver.wait(function() {
      return driver.executeScript('return document.readyState').then(function(readyState) {
            return readyState === 'complete';
      });
     });
    }
    catch(err){
       await driver.close().catch(error => {
        console.log(`Didnt properly login or create session for user ${loginDetails.username}`);
        throw(error);
      });
    }
    finally {
      await driver.close().catch(error => {
        console.log(`Didnt close properly for user ${loginDetails.username}`);
        throw(error);
      });
    }
  })
}
