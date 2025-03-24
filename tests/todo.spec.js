import { test, expect } from '@playwright/test';

// Increase the timeout for these tests
test.setTimeout(60000);

test.describe('Todo Application', () => {
  test('should allow adding, completing, and deleting todos', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    
    // Verify the page title and heading
    await expect(page).toHaveTitle(/Todo App/);
    await expect(page.locator('h1')).toContainText('Todo App');
    
    // Create a unique todo text to avoid test flakiness
    const todoText = `Test todo ${Date.now()}`;
    
    // Add a new todo
    await page.locator('input[placeholder="Add a new todo"]').fill(todoText);
    await page.locator('button', { hasText: 'Add Todo' }).click();
    
    // Verify the new todo appears in the list
    const todoItem = page.locator('.todo-item', { hasText: todoText });
    await expect(todoItem).toBeVisible();
    
    // Initially, the todo should not be completed
    await expect(todoItem).not.toHaveClass(/completed/);
    
    // Toggle the todo's completion status
    await todoItem.locator('.todo-checkbox, [data-testid="todo-toggle"]').click();
    
    // Verify the todo is now marked as completed
    await expect(todoItem).toHaveClass(/completed/);
    
    // Take a screenshot after marking as completed
    await page.screenshot({ path: 'tests/screenshots/todo-completed.png' });
    
    // Delete the todo
    await todoItem.locator('.delete-button, [data-testid="todo-delete"]').click();
    
    // Verify the todo has been removed from the list
    await expect(todoItem).not.toBeVisible();
    
    // Take a final screenshot
    await page.screenshot({ path: 'tests/screenshots/todo-deleted.png' });
  });
  
  test('should handle empty input validation', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    
    // Try to add an empty todo
    await page.locator('input[placeholder="Add a new todo"]').fill('');
    
    // Check that the button is disabled for empty input
    const addButton = page.locator('button', { hasText: 'Add Todo' });
    await expect(addButton).toBeDisabled();
    
    // Try with valid input - button should be enabled
    await page.locator('input[placeholder="Add a new todo"]').fill('Valid todo text');
    await expect(addButton).toBeEnabled();
  });

  test('should show loading state when fetching todos', async ({ page }) => {
    // Navigate to the app with network throttling to see loading state
    await page.route('**/api/todos', async (route) => {
      // Delay the API response to ensure we can see the loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('http://localhost:5173/');
    
    // Check if loading indicator is visible
    const loadingIndicator = page.locator('.loading');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for the loading to complete
    await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
  });
});

