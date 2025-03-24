import { test, expect } from '@playwright/test';

// API Test Suite
test.describe('Todo API Tests', () => {
  const BASE_URL = 'http://localhost:5002';
  
  test('should get all todos', async ({ request }) => {
    // Make a GET request
    const response = await request.get(`${BASE_URL}/api/todos`);
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Verify response body is an array
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    
    // Verify array properties
    if (body.length > 0) {
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('text');
      expect(body[0]).toHaveProperty('completed');
    }
  });
  
  test('should create a new todo', async ({ request }) => {
    // Create a unique todo
    const todoText = `API Test Todo ${Date.now()}`;
    
    // Make a POST request
    const response = await request.post(`${BASE_URL}/api/todos`, {
      data: {
        text: todoText
      }
    });
    
    // Verify response status
    expect(response.status()).toBe(201);
    
    // Verify response body
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.text).toBe(todoText);
    expect(body.completed).toBe(false);
    
    // Store ID for later tests
    return body.id;
  });
  
  test('should update a todo', async ({ request }) => {
    // First create a todo
    const createResponse = await request.post(`${BASE_URL}/api/todos`, {
      data: {
        text: 'Todo to be updated'
      }
    });
    
    const createdTodo = await createResponse.json();
    const todoId = createdTodo.id;
    
    // Now update it
    const updateResponse = await request.put(`${BASE_URL}/api/todos/${todoId}`, {
      data: {
        text: 'Updated todo text',
        completed: true
      }
    });
    
    // Verify response status
    expect(updateResponse.status()).toBe(200);
    
    // Verify response body
    const updatedTodo = await updateResponse.json();
    expect(updatedTodo.id).toBe(todoId);
    expect(updatedTodo.text).toBe('Updated todo text');
    expect(updatedTodo.completed).toBe(true);
  });
  
  test('should delete a todo', async ({ request }) => {
    // First create a todo
    const createResponse = await request.post(`${BASE_URL}/api/todos`, {
      data: {
        text: 'Todo to be deleted'
      }
    });
    
    const createdTodo = await createResponse.json();
    const todoId = createdTodo.id;
    
    // Now delete it
    const deleteResponse = await request.delete(`${BASE_URL}/api/todos/${todoId}`);
    
    // Verify response status
    expect(deleteResponse.status()).toBe(200);
    
    // Verify the todo was deleted by trying to get it
    const getResponse = await request.get(`${BASE_URL}/api/todos/${todoId}`);
    expect(getResponse.status()).toBe(404);
  });
  
  test('should handle invalid requests', async ({ request }) => {
    // Try to create todo without text
    const invalidCreateResponse = await request.post(`${BASE_URL}/api/todos`, {
      data: {}
    });
    
    // Verify we get a 400 Bad Request
    expect(invalidCreateResponse.status()).toBe(400);
    
    // Try to get non-existent todo
    const getNonExistentResponse = await request.get(`${BASE_URL}/api/todos/non-existent-id`);
    
    // Verify we get a 404 Not Found
    expect(getNonExistentResponse.status()).toBe(404);
  });
}); 