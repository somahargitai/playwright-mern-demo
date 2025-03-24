import { test, expect } from '@playwright/test';

// Increase the timeout for these tests
test.setTimeout(60000);

// Our test data
const USER_FLOWS = {
  todoList: [
    { text: 'Buy groceries', completed: false },
    { text: 'Clean the house', completed: false },
    { text: 'Pay bills', completed: false },
    { text: 'Call mom', completed: false }
  ]
};

// Setup function to add multiple todos
async function setupTodos(page, todos) {
  for (const todo of todos) {
    await page.locator('input[placeholder="Add a new todo"]').fill(todo.text);
    await page.locator('button', { hasText: 'Add Todo' }).click();
    
    // If todo should be completed, mark it as such
    if (todo.completed) {
      await page.locator('.todo-item', { hasText: todo.text })
        .locator('.todo-checkbox, [data-testid="todo-toggle"]')
        .click();
    }
  }
}

// Complete user journey demonstration
test.describe('Complete User Journey', () => {
  // Use a single browser context for all tests in this describe block
  test.use({ viewport: { width: 1280, height: 720 } });
  
  test.describe.configure({ mode: 'serial' });
  
  test('should navigate to app and see the title', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/Todo App/);
    await expect(page.locator('h1')).toContainText('Todo App');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'tests/screenshots/user-flow-1-initial.png' });
  });
  
  test('should add multiple todos as a batch', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Add all the todos
    await setupTodos(page, USER_FLOWS.todoList);
    
    // Verify all todos were added
    const todoCount = await page.locator('.todo-item').count();
    expect(todoCount).toBe(USER_FLOWS.todoList.length);
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/user-flow-2-todos-added.png' });
  });
  
  test('should complete all todos in sequence', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Add the todos first
    await setupTodos(page, USER_FLOWS.todoList);
    
    // Complete all todos one by one
    for (const todo of USER_FLOWS.todoList) {
      await page.locator('.todo-item', { hasText: todo.text })
        .locator('.todo-checkbox, [data-testid="todo-toggle"]')
        .click();
      
      // Verify that the todo is now completed
      await expect(
        page.locator('.todo-item', { hasText: todo.text })
      ).toHaveClass(/completed/);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/user-flow-3-todos-completed.png' });
  });
  
  test('should delete all todos in sequence', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Add the todos first
    await setupTodos(page, USER_FLOWS.todoList);
    
    // Get initial count
    const initialCount = await page.locator('.todo-item').count();
    
    // Delete todos one by one
    for (let i = 0; i < initialCount; i++) {
      // Always delete the first item in the list
      await page.locator('.todo-item').first()
        .locator('.delete-button, [data-testid="todo-delete"]')
        .click();
      
      // Check that the number of todos decreases
      await expect(page.locator('.todo-item')).toHaveCount(initialCount - (i + 1));
    }
    
    // Verify all todos are gone
    await expect(page.locator('.todo-item')).toHaveCount(0);
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/user-flow-4-todos-deleted.png' });
  });
  
  test('should handle a typical daily workflow', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // 1. Add a few initial todos for the day
    const morningTodos = [
      { text: 'Morning exercise', completed: false },
      { text: 'Check emails', completed: false }
    ];
    
    await setupTodos(page, morningTodos);
    
    // 2. Mark first task as completed
    await page.locator('.todo-item', { hasText: 'Morning exercise' })
      .locator('.todo-checkbox, [data-testid="todo-toggle"]')
      .click();
    
    // Screenshot after morning tasks
    await page.screenshot({ path: 'tests/screenshots/user-flow-5-morning.png' });
    
    // 3. Add more todos as the day progresses
    const afternoonTodos = [
      { text: 'Lunch break', completed: false },
      { text: 'Team meeting', completed: false }
    ];
    
    await setupTodos(page, afternoonTodos);
    
    // 4. Complete some more todos
    await page.locator('.todo-item', { hasText: 'Check emails' })
      .locator('.todo-checkbox, [data-testid="todo-toggle"]')
      .click();
    
    await page.locator('.todo-item', { hasText: 'Lunch break' })
      .locator('.todo-checkbox, [data-testid="todo-toggle"]')
      .click();
    
    // Screenshot after afternoon progress
    await page.screenshot({ path: 'tests/screenshots/user-flow-6-afternoon.png' });
    
    // 5. Add evening todos
    const eveningTodos = [
      { text: 'Evening workout', completed: false },
      { text: 'Dinner with family', completed: false }
    ];
    
    await setupTodos(page, eveningTodos);
    
    // 6. Complete team meeting
    await page.locator('.todo-item', { hasText: 'Team meeting' })
      .locator('.todo-checkbox, [data-testid="todo-toggle"]')
      .click();
    
    // Final screenshot of the day
    await page.screenshot({ path: 'tests/screenshots/user-flow-7-endofday.png' });
    
    // Verify final state
    await expect(page.locator('.todo-item')).toHaveCount(6);
    await expect(page.locator('.todo-item.completed')).toHaveCount(4);
  });
}); 