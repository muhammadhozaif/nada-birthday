const { chromium } = require("C:/Users/HP/AppData/Roaming/npm/node_modules/@executeautomation/playwright-mcp-server/node_modules/playwright");
const path = require("path");

async function testVideo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Click Press to Celebrate
  console.log("Unlocking celebration...");
  const celebrateBtn = page.locator("text=Press to Celebrate");
  if ((await celebrateBtn.count()) > 0) {
    await celebrateBtn.click();
  }

  await page.waitForTimeout(1500);

  // Check video element
  const video = page.locator("video").first();
  const src = await video.getAttribute("src");
  console.log("Video src attribute:", src);

  // Take screenshot of Celebration Dashboard with video player
  await page.screenshot({ path: "scripts/screenshots/dashboard_video.png" });
  console.log("Saved dashboard_video.png");

  // Hover over the video player to reveal overlay controls
  const videoContainer = page.locator("div[class*='aspect-video']").first();
  await videoContainer.hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scripts/screenshots/video_hover_controls.png" });
  console.log("Saved video_hover_controls.png");

  await browser.close();
  console.log("Test completed successfully!");
}

testVideo().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
