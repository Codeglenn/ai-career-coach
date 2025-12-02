import { AiCareerAgent } from '@/inngest/functions';
import { AiCareerChatAgent } from '@/inngest/functions';

// Mock the AI agent
jest.mock('@/inngest/functions', () => ({
  ...jest.requireActual('@/inngest/functions'),
  AiCareerChatAgent: {
    run: jest.fn(),
  },
}));

const mockedChatAgent = AiCareerChatAgent as jest.Mocked<typeof AiCareerChatAgent>;

describe('AiCareerAgent Inngest Function', () => {
  const mockEvent = {
    data: {
      userInput: 'How do I prepare for a software engineering interview?',
    },
  };

  const mockStep = {
    run: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('processes career question and returns response', async () => {
    const mockResponse = {
      content: 'To prepare for a software engineering interview, focus on...',
      role: 'assistant',
    };

    mockedChatAgent.run = jest.fn().mockResolvedValue(mockResponse);

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'analyzeCareerQuestion') {
        return await fn();
      }
      return null;
    });

    const result = await AiCareerAgent({ event: mockEvent, step: mockStep } as any);

    expect(mockedChatAgent.run).toHaveBeenCalledWith(
      mockEvent.data.userInput,
      { step: mockStep }
    );
    expect(result).toEqual(mockResponse);
  });

  it('handles empty user input', async () => {
    const eventWithEmptyInput = {
      data: {
        userInput: '',
      },
    };

    mockedChatAgent.run = jest.fn().mockResolvedValue({
      content: 'Please provide a career-related question.',
    });

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'analyzeCareerQuestion') {
        return await fn();
      }
      return null;
    });

    await AiCareerAgent({ event: eventWithEmptyInput, step: mockStep } as any);

    expect(mockedChatAgent.run).toHaveBeenCalled();
  });

  it('handles AI agent errors', async () => {
    mockedChatAgent.run = jest.fn().mockRejectedValue(new Error('AI service error'));

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'analyzeCareerQuestion') {
        return await fn();
      }
      return null;
    });

    await expect(
      AiCareerAgent({ event: mockEvent, step: mockStep } as any)
    ).rejects.toThrow('AI service error');
  });
});

