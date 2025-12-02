// Learn more: https://github.com/testing-library/jest-dom
import 'whatwg-fetch';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
// Provide TextEncoder/TextDecoder in the Jest/node environment
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
// Provide ReadableStream from node's web streams if available
try {
  // Node 16+ exposes web streams in 'stream/web'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ReadableStream } = require('stream/web');
  global.ReadableStream = global.ReadableStream || ReadableStream;
} catch (e) {
  // ignore if not available
}

// Provide TransformStream if available (some libs expect it)
try {
  const { TransformStream } = require('stream/web');
  global.TransformStream = global.TransformStream || TransformStream;
} catch (e) {
  // fallback: no-op stub to avoid crashes in tests
  if (typeof global.TransformStream === 'undefined') {
    // minimal stub
    // eslint-disable-next-line no-inner-declarations
    function _TransformStreamStub() {
      this.readable = {};
      this.writable = {};
    }
    global.TransformStream = _TransformStreamStub;
  }
}

// Ensure `File.prototype.arrayBuffer` exists in the test environment
try {
  if (typeof File !== 'undefined' && !File.prototype.arrayBuffer) {
    // eslint-disable-next-line no-extend-native
    File.prototype.arrayBuffer = async function () {
      if (typeof this.text === 'function') {
        const txt = await this.text();
        const buf = Buffer.from(txt);
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      }
      return new ArrayBuffer(0);
    };
  }
} catch (e) {
  // ignore
}

import { server } from './__tests__/mocks/msw/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// `next/navigation` is mocked via a manual mock in `__mocks__/next-navigation.js`
// so tests can call `useRouter.mockReturnValue` when needed.

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-v4'),
}));

// Suppress console errors in tests unless needed
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

