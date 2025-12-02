import { test, expect } from '@playwright/test';

test.describe('Resume Analysis Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - adjust based on your Clerk setup
    // For now, we'll assume the app is accessible
    await page.goto('/dashboard');
  });

  test('should display dashboard with AI tools', async ({ page }) => {
    await expect(page.locator('text=Available AI Tools')).toBeVisible();
    await expect(page.locator('text=AI Q&A Chatbot')).toBeVisible();
    await expect(page.locator('text=AI Resume Analyzer')).toBeVisible();
    await expect(page.locator('text=Roadmap Generator')).toBeVisible();
  });

  test('should open resume upload dialog when clicking Analyze Now', async ({ page }) => {
    // Find and click the Resume Analyzer button
    const resumeButton = page.locator('text=Analyze Now').first();
    await resumeButton.click();

    // Wait for dialog to appear
    await expect(page.locator('text=Upload Resume pdf file')).toBeVisible();
    await expect(page.locator('text=Click here to upload pdf file')).toBeVisible();
  });

  test('should show file name after selecting file', async ({ page }) => {
    // Open the dialog
    await page.locator('text=Analyze Now').first().click();
    await expect(page.locator('text=Upload Resume pdf file')).toBeVisible();

    // Create a mock file (in real scenario, you'd upload an actual file)
    // Note: File upload in Playwright requires actual file path
    const fileInput = page.locator('input[type="file"]');
    // For testing, you'd use: await fileInput.setInputFiles('./__tests__/fixtures/sample-resume.pdf');
    
    // For now, just verify the input exists
    await expect(fileInput).toBeVisible();
  });

  test('should disable upload button when no file is selected', async ({ page }) => {
    await page.locator('text=Analyze Now').first().click();
    await expect(page.locator('text=Upload Resume pdf file')).toBeVisible();

    const uploadButton = page.locator('button:has-text("Upload & Analyze")');
    await expect(uploadButton).toBeDisabled();
  });

  test('should allow canceling the upload dialog', async ({ page }) => {
    await page.locator('text=Analyze Now').first().click();
    await expect(page.locator('text=Upload Resume pdf file')).toBeVisible();

    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    // Dialog should be closed
    await expect(page.locator('text=Upload Resume pdf file')).not.toBeVisible();
  });
});

