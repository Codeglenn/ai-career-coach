// Mock for Clerk server-side functions
export const currentUser = jest.fn().mockResolvedValue({
  id: 'test-user-id-123',
  emailAddresses: [
    {
      emailAddress: 'test@example.com',
    },
  ],
  primaryEmailAddress: {
    emailAddress: 'test@example.com',
  },
  firstName: 'Test',
  lastName: 'User',
});

export const auth = jest.fn().mockReturnValue({
  userId: 'test-user-id-123',
});

