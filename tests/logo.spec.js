import { test, expect } from '@playwright/test';

// Increase the timeout for these tests
test.setTimeout(60000);

test.describe('Logo and UI Tests', () => {
  test('should display logo in the header', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    
    // Check if the logo is visible in the header
    const logo = page.locator('.app-logo');
    await expect(logo).toBeVisible();
    
    // Verify the logo source
    const logoSrc = await logo.getAttribute('src');
    expect(logoSrc).toContain('/icons/logo.svg');
    
    // Verify the logo alt text for accessibility
    const logoAlt = await logo.getAttribute('alt');
    expect(logoAlt).toBe('Todo App Logo');
    
    // Take a screenshot focusing on the header with logo
    await page.locator('.logo-container').screenshot({ path: 'tests/screenshots/app-logo.png' });
  });
  
  test('should have proper favicon in document head', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    
    // Check for favicon link tags
    const favicons = await page.locator('link[rel="icon"]').all();
    expect(favicons.length).toBeGreaterThan(0);
    
    // Check for at least one favicon that points to our custom icon
    let hasCustomFavicon = false;
    for (const favicon of favicons) {
      const href = await favicon.getAttribute('href');
      if (href && (href.includes('favicon-16x16.svg') || href.includes('favicon-32x32.svg') || href.includes('logo.svg'))) {
        hasCustomFavicon = true;
        break;
      }
    }
    
    expect(hasCustomFavicon).toBeTruthy();
    
    // Check for web app manifest
    const manifest = await page.locator('link[rel="manifest"]').first();
    await expect(manifest).toBeAttached();
    const manifestHref = await manifest.getAttribute('href');
    expect(manifestHref).toBe('/manifest.json');
  });
}); 