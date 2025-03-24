import { test, expect } from '@playwright/test';

// Increase the timeout for these tests
test.setTimeout(60000);

// Test for demonstrating visual comparison
test.describe('Visual Testing', () => {
  test('todo app visual comparison', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Take screenshot of the entire page
    await expect(page).toHaveScreenshot('todo-app-initial.png', {
      fullPage: true,
      // Adjust threshold for comparison to account for minor differences
      threshold: 0.2
    });
    
    // Add a todo to change the page state
    await page.locator('input[placeholder="Add a new todo"]').fill('Visual test todo');
    await page.locator('button', { hasText: 'Add Todo' }).click();
    
    // Take another screenshot after adding todo
    await expect(page).toHaveScreenshot('todo-app-with-item.png', {
      fullPage: true,
      threshold: 0.2
    });
  });
});

// Test for demonstrating network interception and mocking
test.describe('Network Interception', () => {
  test('mock API responses', async ({ page }) => {
    // Mock the GET todos endpoint to return custom data
    await page.route('**/api/todos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'mock-1', text: 'Mocked Todo 1', completed: false },
          { id: 'mock-2', text: 'Mocked Todo 2', completed: true }
        ])
      });
    });
    
    // Navigate to app, which will use our mocked data
    await page.goto('http://localhost:5173/');
    
    // Verify our mocked todos appear
    await expect(page.locator('.todo-item')).toHaveCount(2);
    await expect(page.locator('.todo-item').nth(1)).toHaveClass(/completed/);
    
    // Verify mocked text appears
    await expect(page.locator('.todo-item').nth(0)).toContainText('Mocked Todo 1');
  });
  
  test('simulate network errors', async ({ page }) => {
    // Mock the todos API to return an error
    await page.route('**/api/todos', route => route.fulfill({ 
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' })
    }));
    
    // Navigate to app, which should show an error
    await page.goto('http://localhost:5173/');
    
    // Check that error message is displayed
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText(/failed to fetch/i);
  });
});

// Test for demonstrating different viewport sizes
test.describe('Responsive Design Testing', () => {
  // Test on mobile viewport
  test('todo app on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    
    await page.goto('http://localhost:5173/');
    
    // Take screenshot with mobile viewport
    await page.screenshot({ path: 'tests/screenshots/todo-mobile.png' });
    
    // Add a todo on mobile
    await page.locator('input[placeholder="Add a new todo"]').fill('Mobile todo');
    await page.locator('button', { hasText: 'Add Todo' }).click();
    
    // Verify the todo was added
    await expect(page.locator('.todo-item', { hasText: 'Mobile todo' })).toBeVisible();
  });
  
  // Test on tablet viewport
  test('todo app on tablet', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    
    await page.goto('http://localhost:5173/');
    
    // Take screenshot with tablet viewport
    await page.screenshot({ path: 'tests/screenshots/todo-tablet.png' });
  });
});

// Accessibility testing demonstration
test.describe('Accessibility Testing', () => {
  test('check accessibility of todo app', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Take accessibility snapshot (this requires the @axe-core/playwright package in a real implementation)
    // For demonstration, we'll just check some basic accessibility features
    
    // Check that inputs have labels or aria-labels
    const todoInput = page.locator('input[placeholder="Add a new todo"]');
    await expect(todoInput).toHaveAttribute('placeholder');
    
    // Check that buttons have accessible names
    const addButton = page.locator('button', { hasText: 'Add Todo' });
    await expect(addButton).not.toBeEmpty();
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toBeVisible();
  });
}); 