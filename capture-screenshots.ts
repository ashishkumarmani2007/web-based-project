import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
const ARTIFACT_DIR = 'C:\\Users\\AKSHAT TIWARI\\.gemini\\antigravity\\brain\\e3d2fc5c-cb6e-4c7b-b2f2-17a0ef445c77';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}
async function capture() {
  console.log('Launching browser for automated screenshot generation...');
  const browser = await chromium.launch({ headless: true });
  // 1. Desktop Context
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  console.log('Capturing Landing Page...');
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'landing.png'), fullPage: true });
  console.log('Capturing Demo - Clone Threat Outcome (POSSIBLE_AI)...');
  await page.goto('http://localhost:3000/demo');
  await page.waitForLoadState('networkidle');
  // Click scenario 2
  await page.getByText(/Scenario 2: Cloned Voice/i).first().click();
  // Wait for decision banner
  await page.waitForSelector('text=This may be an AI-cloned voice', { timeout: 15000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-clone-danger.png'), fullPage: false });
  // Also trigger payment modal to capture the blocked transaction
  await page.getByRole('button', { name: /Try to send ₹50,000/i }).click();
  await page.waitForSelector('text=TRANSACTION BLOCKED BY VOICE SECURE', { timeout: 5000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-payment-blocked.png'), fullPage: false });
