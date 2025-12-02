import { test, expect } from '@playwright/test';

test.describe('Chatbot Workflow', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/career/i);
  });
});

