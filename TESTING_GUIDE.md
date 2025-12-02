# Testing Guide for AI Career Coach

This document provides a comprehensive guide to the testing setup and strategy for the AI Career Coach application.

## Table of Contents

1. [Overview](#overview)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Mocking Strategy](#mocking-strategy)
6. [Best Practices](#best-practices)
7. [Coverage Goals](#coverage-goals)

## Overview

The testing infrastructure includes:

- **Jest** - Unit and integration testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end browser testing
- **MSW (Mock Service Worker)** - API mocking for integration tests
- **Comprehensive mocks** for external services (Clerk, Inngest, ImageKit)

## Test Structure

```
__tests__/
├── unit/                    # Unit tests
│   ├── components/         # React component tests
│   └── utils/              # Utility function tests
├── integration/            # Integration tests
│   ├── api/               # API route tests
│   └── inngest/           # Inngest function tests
├── e2e/                   # End-to-end tests
│   └── workflows/         # User workflow tests
├── fixtures/              # Test data files
└── mocks/                 # Mock configurations
    └── msw/               # MSW handlers and server
```

## Running Tests

### Install Dependencies

First, install all testing dependencies:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

### Watch Mode

Run tests in watch mode for development:

```bash
npm run test:watch
```

### Coverage Report

Generate and view test coverage:

```bash
npm run test:coverage
```

Coverage reports are generated in the `/coverage` directory.

## Writing Tests

### Unit Tests

Unit tests focus on testing individual components and functions in isolation.

**Example: Component Test**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Integration Tests

Integration tests verify that different parts of the system work together.

**Example: API Route Test**

```typescript
import { POST } from '@/app/api/my-route/route';
import { NextRequest } from 'next/server';

describe('/api/my-route', () => {
  it('processes request correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();
    
    expect(data).toEqual({ success: true });
  });
});
```

### E2E Tests

E2E tests simulate real user workflows in a browser.

**Example: E2E Test**

```typescript
import { test, expect } from '@playwright/test';

test('user can upload resume', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Analyze Now');
  await expect(page.locator('text=Upload Resume')).toBeVisible();
});
```

## Mocking Strategy

### External Services

External services are mocked to ensure tests are fast, reliable, and don't depend on external APIs.

#### Mocked Services:

1. **Clerk Authentication**
   - Location: `__mocks__/@clerk/nextjs.tsx`
   - Mocks: `useUser`, `currentUser`, `SignedIn`, `SignedOut`

2. **Inngest**
   - Location: `__mocks__/inngest/client.ts`
   - Mocks: `inngest.send()`, `inngest.functions`

3. **ImageKit**
   - Location: `__mocks__/imagekit.ts`
   - Mocks: File upload functionality

4. **Axios**
   - Location: `__mocks__/axios.ts`
   - Mocks: HTTP requests

### MSW (Mock Service Worker)

MSW is used to intercept HTTP requests at the network level.

**Example: Custom Handler**

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/my-endpoint', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ received: body });
  }),
];
```

## Best Practices

### 1. Test Structure

- **Arrange**: Set up test data and mocks
- **Act**: Execute the code under test
- **Assert**: Verify the expected outcome

```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [10, 20, 30];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(60);
});
```

### 2. Test Naming

Use descriptive test names that explain what is being tested:

```typescript
// Good
it('should disable submit button when form is invalid', () => {});

// Bad
it('should work', () => {});
```

### 3. Isolation

Each test should be independent and not rely on other tests:

```typescript
beforeEach(() => {
  // Reset state before each test
  jest.clearAllMocks();
});
```

### 4. Test Data

Use fixtures and factories for test data:

```typescript
const createMockUser = (overrides = {}) => ({
  id: '123',
  email: 'test@example.com',
  ...overrides,
});
```

### 5. Async Testing

Properly handle async operations:

```typescript
it('should fetch user data', async () => {
  const data = await fetchUser();
  expect(data).toBeDefined();
});

// Or with waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## Coverage Goals

Current coverage targets:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Viewing Coverage

After running `npm run test:coverage`, open:

```
coverage/lcov-report/index.html
```

## Testing AI Agents

Testing AI agents presents unique challenges due to non-deterministic responses.

### Strategy

1. **Test Structure, Not Content**
   - Verify JSON schema compliance
   - Check required fields exist
   - Validate data types

2. **Mock AI Responses**
   - Use deterministic mock responses
   - Test error handling
   - Verify response processing

3. **Test Integration Points**
   - Verify agents receive correct inputs
   - Check database persistence
   - Validate file uploads

### Example

```typescript
it('returns valid resume analysis schema', async () => {
  const result = await AiResumeAnalyzerAgent.run(mockResumeText);
  const parsed = JSON.parse(result);
  
  expect(parsed).toHaveProperty('overall_score');
  expect(parsed.overall_score).toBeGreaterThanOrEqual(0);
  expect(parsed.overall_score).toBeLessThanOrEqual(100);
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout: `jest.setTimeout(10000)`
   - Check for unresolved promises

2. **Mock not working**
   - Verify mock is in correct location
   - Check Jest configuration
   - Ensure mocks are cleared between tests

3. **E2E tests failing**
   - Ensure dev server is running
   - Check Playwright browser installation
   - Verify selectors are correct

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)

## Getting Help

If you encounter issues:

1. Check test output for error messages
2. Review mock configurations
3. Verify dependencies are installed
4. Consult the testing documentation
5. Check existing test examples in `__tests__/`

