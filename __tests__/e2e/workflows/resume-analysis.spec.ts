import { test, expect } from '@playwright/test';

test.describe('Resume Analysis Workflow', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/career/i);
  });
});
    await expect(page.locator('text=Upload Resume pdf file')).toBeVisible();

    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    // Dialog should be closed
    await expect(page.locator('text=Upload Resume pdf file')).not.toBeVisible();
  });
});

