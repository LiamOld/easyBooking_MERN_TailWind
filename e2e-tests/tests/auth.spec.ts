import { test, expect } from "@playwright/test";

const URL = "http://localhost:5173/";

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("liam2023717@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Sign OK!")).toBeVisible();
});
