import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const out = path.join(process.env.TEMP ?? ".", "marea-qa");
await mkdir(out, { recursive: true });

const base = "http://localhost:5173";
const now = new Date().toISOString();
const seed = {
  profile: {
    onboarded: true,
    name: "friend",
    intention: "calm",
    level: "beginner",
    createdAt: now,
  },
  settings: { lang: "en" },
  languagesUsed: ["en"],
};

const errors = [];

async function newPage(browser, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await context.addInitScript((data) => {
    localStorage.setItem("marea.data.v1", JSON.stringify(data));
    localStorage.setItem("marea.lang", "en");
  }, seed);
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push({ url: page.url(), text: message.text() });
  });
  page.on("pageerror", (error) => errors.push({ url: page.url(), text: error.message }));
  return { context, page };
}

async function shot(page, name, fullPage = false) {
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage });
  console.log("shot", name);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: path.join(
    process.env.LOCALAPPDATA ?? "",
    "ms-playwright",
    "chromium-1243",
    "chrome-win64",
    "chrome.exe",
  ),
});

try {
  const desktop = await newPage(browser, { width: 1440, height: 960 });
  const page = desktop.page;

  await page.goto(`${base}/app/practice/morning-tide?lang=en`, { waitUntil: "networkidle" });
  await shot(page, "player-ready");

  await page.getByRole("button", { name: /^Play$/i }).click();
  await page.waitForTimeout(1400);
  await shot(page, "player-playing");

  await page.getByRole("button", { name: /^Mix$/i }).click();
  await shot(page, "player-mixer");
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: /Finish early/i }).click();
  await shot(page, "player-complete");

  await page.goto(`${base}/app?lang=en`, { waitUntil: "networkidle" });
  await shot(page, "today-desktop");

  await page.goto(`${base}/?lang=en`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await shot(page, "landing-desktop", true);
  await desktop.context.close();

  const mobile = await newPage(browser, { width: 390, height: 844 });
  const mobilePage = mobile.page;

  await mobilePage.goto(`${base}/?lang=en`, { waitUntil: "networkidle" });
  await mobilePage.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
  });
  await shot(mobilePage, "landing-mobile", true);

  await mobilePage.goto(`${base}/app?lang=en`, { waitUntil: "networkidle" });
  await shot(mobilePage, "today-mobile");

  await mobilePage.goto(`${base}/app/breathe?lang=en`, { waitUntil: "networkidle" });
  await shot(mobilePage, "breathe-mobile");

  await mobilePage.goto(`${base}/app/practice/morning-tide?lang=en`, { waitUntil: "networkidle" });
  await shot(mobilePage, "player-ready-mobile");
  await mobile.context.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify({ out, errors }, null, 2));
