import { expect, test, type Page } from "@playwright/test";

/**
 * Smoke-level end-to-end coverage for Marea.
 *
 * Scenarios: landing, the full onboarding walk-through, the player loop,
 * library search and the bilingual experience. Pages are also required to
 * stay free of uncaught JavaScript errors.
 */

type ErrorLog = { __mareaErrors?: string[] };

function trackErrors(page: Page) {
  (page as unknown as ErrorLog).__mareaErrors = [];
  page.on("pageerror", (error) =>
    (page as unknown as ErrorLog).__mareaErrors!.push(error.message),
  );
}

async function expectCleanPage(page: Page) {
  const errors = (page as unknown as ErrorLog).__mareaErrors ?? [];
  expect(errors, "uncaught page errors").toEqual([]);
}

const now = new Date().toISOString();

/** A user who already finished onboarding, mirroring marea.data.v1. */
const seededProfile = {
  profile: { onboarded: true, name: "friend", intention: "calm", level: "beginner", createdAt: now },
  settings: { lang: "en" },
  languagesUsed: ["en"],
};

/** A first-time visitor: onboarding must intercept the app. */
const freshVisitor = {
  profile: { onboarded: false, name: "", intention: "calm", level: "beginner", createdAt: now },
  settings: { lang: "en" },
  languagesUsed: ["en"],
};

function seed(page: Page, data: unknown) {
  // Write once per browser context: a naive addInitScript would overwrite the
  // stored data again on every document load (including reloads), so guard it
  // with a sessionStorage flag.
  return page.addInitScript(
    ([payload, flag]) => {
      if (sessionStorage.getItem(flag as string)) return;
      localStorage.setItem("marea.data.v1", JSON.stringify(payload));
      localStorage.setItem("marea.lang", "en");
      sessionStorage.setItem(flag as string, "1");
    },
    [data, "marea.seeded"],
  );
}

test.describe("Marea smoke suite", () => {
  test("landing invites both languages and sends newcomers to onboarding", async ({ page }) => {
    trackErrors(page);

    await page.goto("/?lang=en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Breathe.");
    await expect(page.getByRole("link", { name: /Explore the library/ })).toBeVisible();

    await page.getByRole("link", { name: /Open Marea/ }).first().click();
    // A visitor who has not finished onboarding is routed there automatically.
    await expect(page).toHaveURL(/\/onboarding/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Which language");
    await expectCleanPage(page);
  });

  test("onboarding walk-through lands on Today and persists", async ({ page }) => {
    trackErrors(page);
    await seed(page, freshVisitor);

    await page.goto("/?lang=en");
    await page.getByRole("link", { name: /Open Marea/ }).first().click();
    await expect(page).toHaveURL(/\/onboarding/);

    await page.getByRole("button", { name: "Continue" }).click(); // 1 — language
    await expect(page.getByRole("heading", { level: 1 })).toContainText("What brings you");
    await page.getByRole("button", { name: "Calm", exact: false }).first().click();
    await page.getByRole("button", { name: "Continue" }).click(); // 2 — intention
    await expect(page.getByRole("heading", { level: 1 })).toContainText("How familiar");
    await page.getByRole("button", { name: "Continue" }).click(); // 3 — level
    await expect(page.getByPlaceholder("Your name")).toBeVisible();
    await page.getByPlaceholder("Your name").fill("River");
    await page.getByRole("button", { name: "Continue" }).click(); // 4 — name
    await page.getByRole("button", { name: "Enter Marea" }).click(); // 5 — voice

    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible();
    await expect(page.getByText("River").first()).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByText("River").first()).toBeVisible();
    await expectCleanPage(page);
  });

  test("seeded user can start and finish a practice", async ({ page }) => {
    trackErrors(page);
    await seed(page, seededProfile);

    await page.goto("/app/practice/morning-tide?lang=en", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Morning tide" })).toBeVisible();

    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.getByText(/STEP 1 OF 8/i)).toBeVisible();

    await page.getByRole("button", { name: /Finish early/i }).click();
    await expect(page.getByText("You showed up.")).toBeVisible();

    await page.getByRole("button", { name: /Back to library/ }).click();
    await expect(page).toHaveURL(/\/app\/library/);
    await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
    await expectCleanPage(page);
  });

  test("library search narrows to matching practices", async ({ page }) => {
    trackErrors(page);
    await seed(page, seededProfile);

    await page.goto("/app/library?lang=en", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();

    const morning = page.locator("a", { hasText: "Morning tide" });
    await expect(morning.first()).toBeVisible();

    await page.getByPlaceholder(/Search/).fill("anxiety");
    await expect(page.locator("a", { hasText: "Anxiety SOS" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Morning tide" })).toHaveCount(0);
    await expectCleanPage(page);
  });

  test("the interface can run in Spanish", async ({ page }) => {
    trackErrors(page);
    await seed(page, seededProfile);

    await page.goto("/app/library?lang=es", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Biblioteca" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Marea de la mañana" })).toBeVisible();

    await page.goto("/app?lang=es", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Buen(os|as) (d[íi]as|tardes|noches)/)).toBeVisible();
    await expectCleanPage(page);
  });

  test("unknown routes render the 404 page", async ({ page }) => {
    trackErrors(page);

    await page.goto("/app/anything-else?lang=en");
    await expect(page.getByRole("heading", { name: /drifted out to sea/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Go home/i })).toBeVisible();
    await expectCleanPage(page);
  });
});
