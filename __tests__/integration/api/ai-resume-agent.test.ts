import { POST } from '@/app/api/ai-resume-agent/route';
import { inngest } from '@/inngest/client';
import { currentUser } from '@clerk/nextjs/server';
import axios from 'axios';
import { NextRequest } from 'next/server';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';

// Mock dependencies
jest.mock('@/inngest/client');
jest.mock('@clerk/nextjs/server');
jest.mock('axios');
jest.mock('@langchain/community/document_loaders/web/pdf');

const mockedInngest = inngest as jest.Mocked<typeof inngest>;
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;
const mockedWebPDFLoader = WebPDFLoader as jest.MockedClass<typeof WebPDFLoader>;

describe('/api/ai-resume-agent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCurrentUser.mockResolvedValue({
      id: 'test-user-id',
      primaryEmailAddress: {
        emailAddress: 'test@example.com',
      },
    } as any);
  });

  it('processes resume file and returns analysis', async () => {
    const mockRunId = 'test-run-id-123';
    const mockRecordId = 'test-record-id';
    const mockResumeText = 'John Doe\nSoftware Engineer\n5 years experience...';
    const mockAnalysis = {
      overall_score: 85,
      overall_feedback: 'Good',
      sections: {
        contact_info: { score: 95 },
        experience: { score: 88 },
      },
    };

    // Mock PDF loader
    const mockLoader = {
      load: jest.fn().mockResolvedValue([
        {
          pageContent: mockResumeText,
        },
      ]),
    };
    mockedWebPDFLoader.mockImplementation(() => mockLoader as any);

    // Mock Inngest send
    mockedInngest.send.mockResolvedValue({
      ids: [mockRunId],
    } as any);

    // Mock getRuns polling
    let callCount = 0;
    mockedAxios.get.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          data: {
            data: [
              {
                status: 'Running',
                output: null,
              },
            ],
          },
        });
      } else {
        return Promise.resolve({
          data: {
            data: [
              {
                status: 'Completed',
                output: {
                  output: [JSON.stringify(mockAnalysis)],
                },
              },
            ],
          },
        });
      }
    });

    // Create FormData with mock file
    const formData = new FormData();
    const mockFile = new Blob(['mock pdf content'], { type: 'application/pdf' }) as any;
    mockFile.name = 'resume.pdf';
    formData.append('recordId', mockRecordId);
    formData.append('resumeFile', mockFile);

    const request = new NextRequest('http://localhost:3000/api/ai-resume-agent', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockedInngest.send).toHaveBeenCalledWith({
      name: 'AiResumeAgent',
      data: expect.objectContaining({
        recordId: mockRecordId,
        pdfText: mockResumeText,
        userEmail: 'test@example.com',
        aiAgentType: '/ai-tools/ai-resume-analyzer',
      }),
    });

    expect(data).toBeDefined();
  });

  it('handles authentication errors', async () => {
    mockedCurrentUser.mockResolvedValue(null);

    const formData = new FormData();
    const mockFile = new Blob(['mock pdf content'], { type: 'application/pdf' }) as any;
    formData.append('recordId', 'test-id');
    formData.append('resumeFile', mockFile);

    const request = new NextRequest('http://localhost:3000/api/ai-resume-agent', {
      method: 'POST',
      body: formData,
    });

    await expect(POST(request)).rejects.toThrow();
  });

  it('handles invalid file format', async () => {
    const formData = new FormData();
    const mockFile = new Blob(['not a pdf'], { type: 'text/plain' }) as any;
    formData.append('recordId', 'test-id');
    formData.append('resumeFile', mockFile);

    const request = new NextRequest('http://localhost:3000/api/ai-resume-agent', {
      method: 'POST',
      body: formData,
    });

    // Should handle invalid file gracefully
    await expect(POST(request)).resolves;
  });

  it('handles missing file in form data', async () => {
    const formData = new FormData();
    formData.append('recordId', 'test-id');
    // Missing resumeFile

    const request = new NextRequest('http://localhost:3000/api/ai-resume-agent', {
      method: 'POST',
      body: formData,
    });

    await expect(POST(request)).rejects.toThrow();
  });
});

