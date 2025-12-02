import { AiResumeAgent } from '@/inngest/functions';
import { db } from '@/configs/db';
import ImageKit from 'imagekit';
import { AiResumeAnalyzerAgent } from '@/inngest/functions';

// Mock dependencies
jest.mock('@/configs/db');
jest.mock('imagekit');
jest.mock('@/inngest/functions', () => ({
  ...jest.requireActual('@/inngest/functions'),
  AiResumeAnalyzerAgent: {
    run: jest.fn(),
  },
}));

const mockedDb = db as jest.Mocked<typeof db>;
const mockedImageKit = ImageKit as jest.MockedClass<typeof ImageKit>;
const mockedAnalyzerAgent = AiResumeAnalyzerAgent as jest.Mocked<typeof AiResumeAnalyzerAgent>;

describe('AiResumeAgent Inngest Function', () => {
  const mockEvent = {
    data: {
      recordId: 'test-record-id',
      base64ResumeFile: 'base64encodedcontent',
      pdfText: 'John Doe\nSoftware Engineer\nExperience...',
      aiAgentType: '/ai-tools/ai-resume-analyzer',
      userEmail: 'test@example.com',
    },
  };

  const mockStep = {
    run: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads resume file to ImageKit', async () => {
    const mockImageKitInstance = {
      upload: jest.fn().mockResolvedValue({
        url: 'https://mock-imagekit-url.com/resume.pdf',
      }),
    };
    mockedImageKit.mockImplementation(() => mockImageKitInstance as any);

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'uploadFile') {
        return await fn();
      }
      return null;
    });

    await AiResumeAgent({ event: mockEvent, step: mockStep } as any);

    expect(mockImageKitInstance.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        file: 'base64encodedcontent',
        fileName: expect.stringContaining('.pdf'),
        isPublished: true,
      })
    );
  });

  it('calls AI analyzer with resume text', async () => {
    const mockAnalysisResult = {
      output: [
        {
          content: JSON.stringify({
            overall_score: 85,
            overall_feedback: 'Good',
          }),
        },
      ],
    };

    mockedAnalyzerAgent.run = jest.fn().mockResolvedValue(mockAnalysisResult);

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'analyzeResume') {
        return await fn();
      }
      return null;
    });

    await AiResumeAgent({ event: mockEvent, step: mockStep } as any);

    expect(mockedAnalyzerAgent.run).toHaveBeenCalledWith(
      mockEvent.data.pdfText,
      { step: mockStep }
    );
  });

  it('saves report to database', async () => {
    const mockUploadUrl = 'https://mock-imagekit-url.com/resume.pdf';
    const mockAnalysisResult = {
      output: [
        {
          content: '{"overall_score":85,"overall_feedback":"Good"}',
        },
      ],
    };

    mockedAnalyzerAgent.run = jest.fn().mockResolvedValue(mockAnalysisResult);
    mockedDb.insert = jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({}),
    }) as any;

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'uploadFile') {
        return mockUploadUrl;
      }
      if (name === 'analyzeResume') {
        return mockAnalysisResult;
      }
      if (name === 'SaveToDb') {
        return await fn();
      }
      return null;
    });

    await AiResumeAgent({ event: mockEvent, step: mockStep } as any);

    expect(mockedDb.insert).toHaveBeenCalled();
  });

  it('parses JSON content correctly', async () => {
    const mockAnalysisResult = {
      output: [
        {
          content: '```json\n{"overall_score":85}\n```',
        },
      ],
    };

    mockedAnalyzerAgent.run = jest.fn().mockResolvedValue(mockAnalysisResult);

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'analyzeResume') {
        return mockAnalysisResult;
      }
      if (name === 'SaveToDb') {
        return await fn();
      }
      return null;
    });

    await AiResumeAgent({ event: mockEvent, step: mockStep } as any);

    // Should parse JSON even with markdown code fences
    expect(mockedDb.insert).toHaveBeenCalled();
  });

  it('handles malformed JSON gracefully', async () => {
    const mockAnalysisResult = {
      output: [
        {
          content: 'not valid json',
        },
      ],
    };

    mockedAnalyzerAgent.run = jest.fn().mockResolvedValue(mockAnalysisResult);

    mockStep.run.mockImplementation(async (name, fn) => {
      if (name === 'analyzeResume') {
        return mockAnalysisResult;
      }
      if (name === 'SaveToDb') {
        return await fn();
      }
      return null;
    });

    await expect(
      AiResumeAgent({ event: mockEvent, step: mockStep } as any)
    ).rejects.toThrow();
  });
});

