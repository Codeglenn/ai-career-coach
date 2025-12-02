import { POST } from '@/app/api/ai-career-chat-agent/route';
import { inngest } from '@/inngest/client';
import axios from 'axios';
import { NextRequest } from 'next/server';

jest.mock('@/inngest/client');
jest.mock('axios');

const mockedInngest = inngest as jest.Mocked<typeof inngest>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AI Career Chat API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends inngest event with user input', async () => {
    const mockRunId = 'test-run-123';
    const mockResponse = {
      content: 'Career advice response',
      role: 'assistant',
    };

    // Mock inngest send to return run ID
    mockedInngest.send.mockResolvedValue({
      ids: [mockRunId],
    } as any);

    // Mock axios to return completed status with response
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [
          {
            status: 'Completed',
            output: {
              output: [mockResponse],
            },
          },
        ],
      },
    });

    const request = new NextRequest('http://localhost:3000/api/ai-career-chat-agent', {
      method: 'POST',
      body: JSON.stringify({
        userInput: 'How do I get better at coding?',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Verify inngest was called with the user input
    expect(mockedInngest.send).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'AiCareerAgent',
        data: expect.objectContaining({
          userInput: 'How do I get better at coding?',
        }),
      })
    );

    // Verify response contains the assistant's message
    expect(data).toEqual(mockResponse);
  });
});

