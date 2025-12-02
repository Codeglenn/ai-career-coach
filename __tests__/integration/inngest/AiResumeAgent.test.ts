import { AiResumeAnalyzerAgent } from '@/inngest/functions';
import { db } from '@/configs/db';
import ImageKit from 'imagekit';

jest.mock('@/configs/db');
jest.mock('imagekit');
jest.mock('@/inngest/functions', () => ({
  AiResumeAnalyzerAgent: {
    run: jest.fn(),
  },
}));

const mockedDb = db as jest.Mocked<typeof db>;
const mockedImageKit = ImageKit as jest.MockedClass<typeof ImageKit>;
const mockedAnalyzerAgent = AiResumeAnalyzerAgent as jest.Mocked<typeof AiResumeAnalyzerAgent>;

describe('AI Resume Analyzer Agent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls analyzer agent with resume text', async () => {
    const mockAnalysisResult = {
      output: [
        {
          content: '{"overall_score":85}',
        },
      ],
    };

    mockedAnalyzerAgent.run = jest.fn().mockResolvedValue(mockAnalysisResult);

    const result = await mockedAnalyzerAgent.run('John Doe\nSoftware Engineer', {
      step: jest.fn(),
    });

    expect(mockedAnalyzerAgent.run).toHaveBeenCalledWith(
      'John Doe\nSoftware Engineer',
      expect.any(Object)
    );
    expect(result).toEqual(mockAnalysisResult);
  });
});

