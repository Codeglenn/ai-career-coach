import { Inngest } from 'inngest';

// In test environments, provide a mocked inngest object so tests can
// spy on `send`. When not testing, export the real Inngest client.
const isTest = typeof process !== 'undefined' && (process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let inngest: any;

if (isTest) {
	// @ts-ignore - jest is available in the test runtime
	inngest = {
		send: jest.fn().mockResolvedValue({ ids: ['mock-run-id-123'] }),
		functions: {
			serve: jest.fn(),
		},
	};
} else {
	// Create a client to send and receive events
	inngest = new Inngest({ id: 'ai-career-coach-agent' });
}

export { inngest };