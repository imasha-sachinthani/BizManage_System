import { test, expect } from '@playwright/test';

test.describe('Settings Security Password Change', () => {
  test('should require confirm password focus and enable Save', async ({ page }) => {
    await page.goto('/settings');
    await page.getByLabel('Current Password').fill('oldpass');
    await page.getByLabel('New Password').fill('newpass123');
    // Save should be disabled until confirm is focused and filled
    const saveBtn = page.getByRole('button', { name: /update security settings/i });
    await expect(saveBtn).toBeDisabled();
    await page.getByLabel('Confirm New Password').focus();
    await page.getByLabel('Confirm New Password').fill('newpass123');
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    await expect(page.getByText('Password changed successfully')).toBeVisible();
  });
  test('should show error if passwords do not match', async ({ page }) => {
    await page.goto('/settings');
    await page.getByLabel('Current Password').fill('oldpass');
    await page.getByLabel('New Password').fill('newpass123');
    await page.getByLabel('Confirm New Password').focus();
    await page.getByLabel('Confirm New Password').fill('different');
    const saveBtn = page.getByRole('button', { name: /update security settings/i });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    await expect(page.getByText('New passwords do not match')).toBeVisible();
  });
});