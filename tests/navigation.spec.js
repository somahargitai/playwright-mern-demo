import { test, expect } from '@playwright/test';

// Increase the timeout for these tests
test.setTimeout(60000);

test.describe('Navigation Tests', () => {
  test('should navigate between pages with correct URLs', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    
    // Check that we start on the home page with correct URL
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.locator('.home-page')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Welcome to the Todo App');
    
    // Take a screenshot of the home page
    await page.screenshot({ path: 'tests/screenshots/home-page.png' });
    
    // Navigate to the todos page
    await page.locator('[data-testid="nav-todos"]').click();
    
    // Verify URL and content
    await expect(page).toHaveURL('http://localhost:5173/todos');
    await expect(page.locator('.todos-page')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Manage Your Todos');
    
    // Wait for todos to load
    await page.locator('.todo-list').waitFor();
    
    // Take a screenshot of the todos page
    await page.screenshot({ path: 'tests/screenshots/todos-page.png' });
    
    // Navigate to the about page
    await page.locator('[data-testid="nav-about"]').click();
    
    // Verify URL and content
    await expect(page).toHaveURL('http://localhost:5173/about');
    await expect(page.locator('.about-page')).toBeVisible();
    await expect(page.locator('h2')).toContainText('About This App');
    
    // Take a screenshot of the about page
    await page.screenshot({ path: 'tests/screenshots/about-page.png' });
    
    // Navigate back to the home page
    await page.locator('[data-testid="nav-home"]').click();
    
    // Verify URL and content
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.locator('.home-page')).toBeVisible();
  });
  
  test('should navigate to todos page using action button', async ({ page }) => {
    // Navigate to the app (home page)
    await page.goto('http://localhost:5173/');
    
    // Click the "Manage Your Todos" button on the home page
    await page.locator('[data-testid="goto-todos-btn"]').click();
    
    // Verify URL and content
    await expect(page).toHaveURL('http://localhost:5173/todos');
    await expect(page.locator('.todos-page')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Manage Your Todos');
  });
  
  test('should show correct task statistics on home page', async ({ page }) => {
    // Create a helper function to add a todo
    async function addTodo(text) {
      await page.goto('http://localhost:5173/todos');
      await page.locator('input[placeholder="Add a new todo"]').fill(text);
      await page.locator('button', { hasText: 'Add Todo' }).click();
    }
    
    // Navigate to the app (home page)
    await page.goto('http://localhost:5173/');
    
    // Add a few todos
    await addTodo('Navigation test todo 1');
    await addTodo('Navigation test todo 2');
    
    // Complete one of the todos
    await page.goto('http://localhost:5173/todos');
    const todoItem = page.locator('.todo-item', { hasText: 'Navigation test todo 1' });
    await todoItem.locator('.todo-checkbox').click();
    
    // Navigate back to home page
    await page.goto('http://localhost:5173/');
    
    // Check the statistics
    const statsValues = page.locator('.stat-value');
    
    // The first stat is completed count (should be at least 1)
    const completedCount = await statsValues.nth(0).textContent();
    expect(Number(completedCount)).toBeGreaterThanOrEqual(1);
    
    // The second stat is pending count (should be at least 1)
    const pendingCount = await statsValues.nth(1).textContent();
    expect(Number(pendingCount)).toBeGreaterThanOrEqual(1);
    
    // The third stat is total count (should be at least 2)
    const totalCount = await statsValues.nth(2).textContent();
    expect(Number(totalCount)).toBeGreaterThanOrEqual(2);
    
    // Take a screenshot showing the stats
    await page.screenshot({ path: 'tests/screenshots/home-page-with-stats.png' });
  });
  
  test('should handle 404 page for unknown routes', async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto('http://localhost:5173/nonexistent-route');
    
    // Verify we see the 404 page
    await expect(page.locator('.not-found-page')).toBeVisible();
    await expect(page.locator('h2')).toContainText('404 - Page Not Found');
    
    // Take a screenshot of the 404 page
    await page.screenshot({ path: 'tests/screenshots/404-page.png' });
    
    // Click the "Return to Home" button
    await page.locator('.not-found-page .primary-button').click();
    
    // Verify we return to home page
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.locator('.home-page')).toBeVisible();
  });
}); 