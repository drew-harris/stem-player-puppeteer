const puppeteer = require("puppeteer");
const lineReader = require("line-reader");

(async () => {
  try {
    links = [];
    lineReader.eachLine("./input.txt", function (line) {
      links = [...links, line];
    });
    const browser = await puppeteer.launch({ headless: false });
    const mainPage = await browser.newPage();
    await mainPage.goto("https://www.stemplayer.com/");

    await mainPage.waitForSelector(".close-button");

    for (let i = 0; i < links.length; i++) {
      // Click LINK
      await mainPage.waitForSelector(".stripped-splitter__text");
      var labels = await mainPage.$$(".stripped-splitter__text");
      await labels[0].click();

      // Type link
      await mainPage.waitForTimeout(200);
      await mainPage.keyboard.type(links[i]);

      // Click UPLOAD
      await mainPage.waitForSelector(".stripped-splitter__button");
      var buttons = await mainPage.$$(".stripped-splitter__button");
      await buttons[0].click();

      // Wait for UPLOADED
      await mainPage.waitForXPath(
        "/html/body/div[1]/div/div/div[2]/div/div/form/button[1]/span[contains(.,'Uploaded')]",
        {
          timeout: 999999999,
        }
      );

      console.log(links[i] + ": UPLOADED");
      // Click ADD ANOTHER
      const addNew = await mainPage.$x(
        "//*[@id=\"main\"]/div/div[2]/div/div/form/button[2]/span[contains(.,'Add')]"
      );
      await addNew[0].click();
    }

    await mainPage.waitForTimeout(3000);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
