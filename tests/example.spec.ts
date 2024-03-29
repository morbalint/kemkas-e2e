import {test, expect, Page} from '@playwright/test';
import * as fs from "fs";
import { PDFDocument } from 'pdf-lib'

test('has title', async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Kém Karakter App");
});

test('roll abilities', async ({page}) => {
  await page.goto("/");

  await page.getByTestId("tulajdonsag-dobas").click()
  const ero = Number(await page.getByTestId("t_ero").inputValue());
  expect(ero).toBeGreaterThanOrEqual(3)
  expect(ero).toBeLessThanOrEqual(18)
  const ugy = Number(await page.getByTestId("t_ugy").inputValue());
  expect(ugy).toBeGreaterThanOrEqual(3)
  expect(ugy).toBeLessThanOrEqual(18)
  const egs = Number(await page.getByTestId("t_egs").inputValue());
  expect(egs).toBeGreaterThanOrEqual(3)
  expect(egs).toBeLessThanOrEqual(18)
  const int = Number(await page.getByTestId("t_int").inputValue());
  expect(int).toBeGreaterThanOrEqual(3)
  expect(int).toBeLessThanOrEqual(18)
  const bol = Number(await page.getByTestId("t_bol").inputValue());
  expect(bol).toBeGreaterThanOrEqual(3)
  expect(bol).toBeLessThanOrEqual(18)
  const kar = Number(await page.getByTestId("t_kar").inputValue());
  expect(kar).toBeGreaterThanOrEqual(3)
  expect(kar).toBeLessThanOrEqual(18)
})

test('simple PDF', async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("nev").fill("Playwright");
  await page.getByTestId("isten").fill("nincs");

  await downloadAndCompare(page, './expectations/Playwright_1.pdf');
});

test('harcos PDF', async ({page}) => {
  await page.goto("/");
  await page.getByTestId("nev").fill("Nazdreg Ug Urdgrub");
  await page.getByTestId("faj").click();
  await expect(page.getByTestId("faj")).toBeVisible();
  await expect(page.getByTestId("faj")).toHaveValue("f_2e_ember")
  await page.getByTestId("faj").selectOption("f_2e_felork");
  await expect(page.getByTestId("faj")).toHaveValue("f_2e_felork")

  await page.getByTestId("osztaly").selectOption("o_2e_harcos");
  await page.getByTestId("harcos-specialization-1").selectOption("bot");
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-2").fill("10")
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-3").fill("10")
  await page.getByTestId("harcos-specialization-3").selectOption("fejsze");
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-4").fill("10")
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-5").fill("10")
  await page.getByTestId("harcos-specialization-5").selectOption("csatabard");
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-6").fill("10")
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-7").fill("10")
  await page.getByTestId("harcos-specialization-7").selectOption("csatabard_2");
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-8").fill("10")
  await page.getByText("Szintlépés!").click()
  await page.getByTestId("HP-9").fill("10")
  await page.getByTestId("harcos-specialization-9").selectOption("csatabard_2");

  await page.getByTestId("pancel").selectOption("mellvert");
  await page.getByTestId("pajzs").selectOption("pajzs_fem");
  await page.getByText("Fegyver hozzáadása").click()
  await page.getByTestId("felszereles-fegyver-0").selectOption("csatabard_2");
  await page.getByText("Fegyver hozzáadása").click()
  await page.getByTestId("felszereles-fegyver-1").selectOption("fejsze");

  await downloadAndCompare(page, './expectations/Nazdreg Ug Urdgrub_9.pdf');
})

async function downloadAndCompare(page: Page, expectedPdfPath: string) {
  const downloadPromise = page.waitForEvent('download');
  await page.getByText("PDF").click()
  const download = await downloadPromise;
  const browserName = page.context().browser().browserType().name();
  const path = `./downloads/${browserName}/${download.suggestedFilename()}`
  await download.saveAs(path)
  const actBuf = fs.readFileSync(path);
  const actualDoc = await PDFDocument.load(actBuf);
  const testBuf = fs.readFileSync(expectedPdfPath);
  const expectedDoc = await PDFDocument.load(testBuf);
  expectedDoc.setModificationDate(actualDoc.getModificationDate())
  const expectedBase64 = await expectedDoc.saveAsBase64()
  const actualBase64 = await actualDoc.saveAsBase64()
  expect(actualBase64).toEqual(expectedBase64)
}