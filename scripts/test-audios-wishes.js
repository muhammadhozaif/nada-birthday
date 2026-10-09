const { chromium } = require("C:/Users/HP/AppData/Roaming/npm/node_modules/@executeautomation/playwright-mcp-server/node_modules/playwright");

async function testAudiosAndWishes() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  const celebrateBtn = page.locator("text=Press to Celebrate");
  if ((await celebrateBtn.count()) > 0) {
    await celebrateBtn.click();
  }

  await page.waitForTimeout(1000);

  // 1. Verify Header has NO mute button
  const muteBtn = page.locator("button:has-text('Music On'), button:has-text('Unmute')");
  console.log("Mute buttons in header:", await muteBtn.count());

  // 2. Capture Jukebox area
  const jukebox = page.locator("h3:has-text('Voice Notes')").first();
  console.log("Jukebox header found:", await jukebox.count());
  await page.screenshot({ path: "scripts/screenshots/jukebox_voices_only.png" });

  // 3. Scroll to Wishes Wall and check count
  const wishesHeader = page.locator("text=Wishes From Loved Ones");
  await wishesHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const wishCards = page.locator("text=Wish From");
  const count = await wishCards.count();
  console.log("Wish cards rendered count:", count);

  await page.screenshot({ path: "scripts/screenshots/9_wishes_wall.png" });

  // 4. Test clicking Pyke modal
  console.log("Testing Pyke modal...");
  const pykeCard = page.locator("h3:has-text('Pyke')");
  if ((await pykeCard.count()) > 0) {
    await pykeCard.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: "scripts/screenshots/modal_pyke.png" });
    const closeBtn = page.locator("button:has-text('Close')").first();
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 5. Test clicking Fahmida modal
  console.log("Testing Fahmida modal...");
  const fahmidaCard = page.locator("h3:has-text('Fahmida')");
  if ((await fahmidaCard.count()) > 0) {
    await fahmidaCard.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: "scripts/screenshots/modal_fahmida.png" });
    const closeBtn = page.locator("button:has-text('Close')").first();
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 6. Test clicking Hayati modal (which has audio!)
  console.log("Testing Hayati modal with voice note...");
  const hayatiCard = page.locator("h3:has-text('Hayati')");
  if ((await hayatiCard.count()) > 0) {
    await hayatiCard.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: "scripts/screenshots/modal_hayati_audio.png" });
    const closeBtn = page.locator("button:has-text('Close')").first();
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  await browser.close();
  console.log("All audio and wish tests finished successfully!");
}

testAudiosAndWishes().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
