// Mock for Clerk client-side hooks
import React, { type ReactNode } from 'react';

export const useUser = jest.fn(() => ({
  user: {
    id: 'test-user-id-123',
    emailAddresses: [
      {
        emailAddress: 'test@example.com',
      },
    ],
    primaryEmailAddress: {
      emailAddress: 'test@example.com',
    },
  },
  isLoaded: true,
  isSignedIn: true,
}));

export const SignedIn = ({ children }: { children: ReactNode }) => <>{children}</>;
export const SignedOut = ({ children }: { children: ReactNode }) => null;
export const UserButton = () => <div data-testid="user-button">User Button</div>;

