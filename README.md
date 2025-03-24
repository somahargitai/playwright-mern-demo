# Playwright MERN Demo

This project demonstrates the powerful capabilities of Playwright for end-to-end testing of a MERN (MongoDB, Express, React, Node.js) stack application. The application is a simple Todo app, but the focus is on showcasing Playwright's testing features.

## 🚀 Features Demonstrated

This project demonstrates the following Playwright capabilities:

### 📋 Basic End-to-End Testing

- Basic page navigation and interaction
- Form submission and validation
- Element selection and assertion
- Checkbox toggling and button clicking

### 🌐 UI Testing

- Visual regression testing with screenshots
- Visual comparison with tolerance thresholds
- Responsive design testing across different viewport sizes
- Accessibility testing basics

### 🔄 API Testing

- Direct API testing with Playwright's request object
- Testing all CRUD operations (GET, POST, PUT, DELETE)
- Asserting on response status and body content
- Handling error states

### 🌍 Network Interception

- Mocking API responses
- Simulating network conditions (throttling, errors)
- Waiting for loading states
- Testing error handling

### 👤 User Flows

- Realistic user journey testing
- Data-driven testing with test fixtures
- Test organization with test.describe
- Serial test execution

## 🛠️ Project Structure

```
├── client/                 # React frontend
├── server/                 # Express backend
├── tests/                  # Playwright tests
│   ├── todo.spec.js        # Basic todo operations
│   ├── api.spec.js         # API endpoint tests
│   ├── advanced-features.spec.js  # Advanced Playwright features
│   └── user-flows.spec.js  # Complete user journeys
└── playwright.config.ts    # Playwright configuration
```

## 🔧 Setup & Running Tests

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running the Application

```bash
# Start both client and server
npm run dev

# Start just the server
npm run server

# Start just the client
npm run client
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in a specific file
npx playwright test tests/todo.spec.js

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in a specific browser
npx playwright test --project=chromium

# Run with UI mode for debugging
npx playwright test --ui
```

## 📚 Playwright Features Explained

### 🔍 Locators

The tests demonstrate various ways to locate elements:

- By role: `page.getByRole('button')`
- By text: `page.getByText('Add Todo')`
- By CSS selector: `page.locator('.todo-item')`
- By test ID: `page.locator('[data-testid="todo-toggle"]')`

### ✅ Assertions

Various assertion types are demonstrated:

- Visual assertions: `expect(page).toHaveScreenshot()`
- Text content: `expect(element).toContainText('text')`
- Element state: `expect(element).toBeVisible()`
- Count assertions: `expect(elements).toHaveCount(2)`
- Class assertions: `expect(element).toHaveClass(/completed/)`

### 📸 Visual Testing

The tests show how to use visual comparison:

- Full page screenshots
- Element-specific screenshots
- Configuring comparison threshold

### 🕸️ Network Control

Network interception capabilities:

- Route interception with `page.route()`
- Mocking responses with `route.fulfill()`
- Delaying responses
- Simulating errors

## 📈 Next Steps & Extensions

To further explore Playwright's capabilities, consider:

1. **Authentication testing**: Implement login/registration flows
2. **Database seeding**: Add direct DB interaction for test setup
3. **Parallel test execution**: Configure Playwright for parallel runs
4. **CI integration**: Set up GitHub Actions or another CI pipeline
5. **Advanced reporting**: Configure custom reporters
6. **Mobile testing**: Enable mobile emulation for testing
7. **Performance testing**: Add basic performance metrics tracking
8. **Component testing**: Add React component testing with Playwright
