import { AiCareerChatAgent } from '@/inngest/functions';

jest.mock('@/inngest/functions', () => ({
  AiCareerChatAgent: {
    run: jest.fn(),
  },
}));

const mockedChatAgent = AiCareerChatAgent as jest.Mocked<typeof AiCareerChatAgent>;

describe('AI Career Chat Agent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls AI agent with user input', async () => {
    const mockResponse = {
      content: 'Career advice response',
      role: 'assistant',
    };

    mockedChatAgent.run = jest.fn().mockResolvedValue(mockResponse);

    const result = await mockedChatAgent.run('How to prepare for interview?', {
      step: jest.fn(),
    });

    expect(mockedChatAgent.run).toHaveBeenCalledWith(
      'How to prepare for interview?',
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });
});

