import { test, expect } from '@playwright/test';
import * as fs from "fs";
import { PDFDocument } from 'pdf-lib'

test('has title', async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Kém Karakter App");
});

test('simple PDF', async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("nev").fill("Playwright");
  await page.getByTestId("isten").fill("nincs");

  const downloadPromise = page.waitForEvent('download');
  await page.getByText("PDF").click()
  const download = await downloadPromise;
  const path = "./downloads/" + download.suggestedFilename()
  await download.saveAs(path)
  const actBuf =  fs.readFileSync(path);
  const actualDoc = await PDFDocument.load(actBuf);
  const testBuf = fs.readFileSync('./expectations/Playwright_1.pdf');
  const expectedDoc = await PDFDocument.load(testBuf);
  expectedDoc.setModificationDate(actualDoc.getModificationDate())
  const expectedBase64 = await expectedDoc.saveAsBase64()
  const actualBase64 = await actualDoc.saveAsBase64()
  expect(actualBase64).toEqual(expectedBase64)
});
