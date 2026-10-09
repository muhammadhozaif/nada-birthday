const { chromium } = require("C:/Users/HP/AppData/Roaming/npm/node_modules/@executeautomation/playwright-mcp-server/node_modules/playwright");
const fs = require("fs");
const path = require("path");

async function main() {
  const screenshotsDir = path.resolve(__dirname, "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Click Press to Celebrate
  console.log("Clicking Press to Celebrate...");
  const celebrateBtn = page.locator("text=Press to Celebrate");
  if (await celebrateBtn.count() > 0) {
    await celebrateBtn.click();
  }

  await page.waitForTimeout(1000);

  // Scroll to Wishes wall
  console.log("Scrolling to Wishes From Loved Ones...");
  const wishesHeader = page.locator("text=Wishes From Loved Ones");
  await wishesHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(screenshotsDir, "01_wishes_wall.png"), fullPage: false });
  console.log("Saved 01_wishes_wall.png");

  // Find all wish cards
  const cards = page.locator("section:has-text('Wishes From Loved Ones') .cursor-pointer");
  const count = await cards.count();
  console.log(`Found ${count} wish cards`);

  // Test clicking Hayati, Vampire, SteelAssassin
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const text = await card.innerText();
    const sender = text.split("\n")[0] || `card_${i}`;
    console.log(`Checking card ${i}: ${sender}`);

    await card.click();
    await page.waitForTimeout(500);

    const safeSender = sender.replace(/[^a-zA-Z0-9]/g, "_");
    await page.screenshot({ path: path.join(screenshotsDir, `modal_${i}_${safeSender}.png`) });
    console.log(`Saved modal_${i}_${safeSender}.png`);

    // Close modal
    const closeBtn = page.locator("button:has-text('Close')");
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click();
      await page.waitForTimeout(400);
    }
  }

  await browser.close();
  console.log("Playwright testing complete!");
}

main().catch((err) => {
  console.error("Playwright error:", err);
  process.exit(1);
});
