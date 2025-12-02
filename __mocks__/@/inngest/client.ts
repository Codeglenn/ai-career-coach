// Manual mock for aliased import '@/inngest/client'
export const inngest = {
  send: jest.fn().mockResolvedValue({ ids: ['mock-run-id-123'] }),
  functions: {
    serve: jest.fn(),
  },
};
