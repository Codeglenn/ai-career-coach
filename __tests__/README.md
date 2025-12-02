# Testing Documentation

This directory contains all tests for the AI Career Coach application.

## Test Structure

```
__tests__/
├── unit/              # Unit tests for components and utilities
│   ├── components/   # React component tests
│   └── utils/        # Utility function tests
├── integration/      # Integration tests for API routes and Inngest functions
│   ├── api/         # API route tests
│   └── inngest/     # Inngest function tests
├── e2e/             # End-to-end tests using Playwright
│   └── workflows/   # User workflow tests
└── fixtures/        # Test data and mock files
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Writing Tests

### Unit Tests
- Test individual components in isolation
- Mock external dependencies
- Focus on component behavior and rendering

### Integration Tests
- Test API routes with mocked external services
- Test Inngest functions with mocked AI agents
- Verify data flow between services

### E2E Tests
- Test complete user workflows
- Use real browser interactions
- Verify end-to-end functionality

## Mocking Strategy

External services are mocked in `__mocks__/`:
- Clerk (authentication)
- Inngest (background jobs)
- ImageKit (file uploads)
- Axios (HTTP requests)

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Use descriptive test names
3. **Coverage**: Aim for high coverage of critical paths
4. **Maintainability**: Keep tests simple and readable
5. **Performance**: Use appropriate test types (unit > integration > e2e)

