# Testing Setup - Installation Instructions

## Quick Start

### 1. Install Testing Dependencies

Due to PowerShell execution policy on Windows, run this command in an elevated PowerShell or Command Prompt:

```bash
npm install --save-dev @playwright/test @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest @types/uuid jest jest-environment-jsdom msw ts-jest
```

**Alternative**: If you encounter PowerShell execution policy issues:

1. Open Command Prompt (cmd) instead of PowerShell, or
2. Run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### 2. Install Playwright Browsers

After installing dependencies, install Playwright browsers:

```bash
npx playwright install
```

### 3. Verify Installation

Run a simple test to verify everything is set up:

```bash
npm test
```

## What Has Been Set Up

### ✅ Configuration Files

- `jest.config.js` - Jest configuration with Next.js integration
- `jest.setup.js` - Test setup with mocks and MSW
- `playwright.config.ts` - Playwright E2E test configuration

### ✅ Mock Files

- `__mocks__/inngest/client.ts` - Inngest mocking
- `__mocks__/@clerk/nextjs.tsx` - Clerk client mocking
- `__mocks__/@clerk/nextjs/server.ts` - Clerk server mocking
- `__mocks__/imagekit.ts` - ImageKit mocking
- `__mocks__/axios.ts` - Axios HTTP mocking

### ✅ Test Files Created

#### Unit Tests
- `__tests__/unit/components/AiToolCard.test.tsx`
- `__tests__/unit/components/ResumeUploadDialog.test.tsx`
- `__tests__/unit/utils/cn.test.ts`

#### Integration Tests
- `__tests__/integration/api/ai-career-chat-agent.test.ts`
- `__tests__/integration/api/ai-resume-agent.test.ts`
- `__tests__/integration/inngest/AiResumeAgent.test.ts`
- `__tests__/integration/inngest/AiCareerChatAgent.test.ts`

#### E2E Tests
- `__tests__/e2e/workflows/resume-analysis.spec.ts`
- `__tests__/e2e/workflows/chatbot.spec.ts`

### ✅ Supporting Files

- `__tests__/mocks/msw/handlers.ts` - MSW API handlers
- `__tests__/mocks/msw/server.ts` - MSW server setup
- `__tests__/fixtures/` - Test data files
- `__tests__/README.md` - Test documentation
- `TESTING_GUIDE.md` - Comprehensive testing guide

### ✅ Package.json Updates

Added test scripts:
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - Coverage report
- `npm run test:unit` - Unit tests only
- `npm run test:integration` - Integration tests only
- `npm run test:e2e` - E2E tests
- `npm run test:e2e:ui` - E2E tests with UI

## Next Steps

1. **Install dependencies** (see above)
2. **Review the tests** to understand the testing patterns
3. **Run tests** to see everything working
4. **Write more tests** following the existing patterns
5. **Check coverage** to identify areas needing more tests

## Test Coverage

The setup includes coverage thresholds (70% for branches, functions, lines, statements). These are configured in `jest.config.js`.

## Environment Variables

Make sure you have the following environment variables set for tests (or use `.env.test`):

```env
INNGEST_SERVER_HOST=http://localhost:8288
INNGEST_SIGNING_KEY=test-key
GEMINI_API_KEY=test-key
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=test-connection-string
```

## Troubleshooting

### Issue: PowerShell execution policy

**Solution**: Use Command Prompt or run PowerShell as Administrator

### Issue: Playwright browsers not installed

**Solution**: Run `npx playwright install`

### Issue: Tests failing with module not found

**Solution**: Ensure all dependencies are installed: `npm install`

### Issue: MSW not intercepting requests

**Solution**: Verify MSW server is started in `jest.setup.js`

## Documentation

- See `TESTING_GUIDE.md` for comprehensive testing documentation
- See `__tests__/README.md` for test structure details
- See existing test files for examples

## Support

For issues or questions:
1. Check the error messages in test output
2. Review the mock configurations
3. Consult the testing guide
4. Review existing test examples

