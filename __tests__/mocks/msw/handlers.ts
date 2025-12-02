import { http, HttpResponse } from 'msw';

// Mock API handlers for MSW (Mock Service Worker)
export const handlers = [
  // Mock Inngest runs endpoint
  http.get('*/v1/events/:runId/runs', ({ params }) => {
    const { runId } = params;
    return HttpResponse.json({
      data: [
        {
          id: runId,
          status: 'Completed',
          output: {
            output: [
              {
                content: 'Mock AI response',
                role: 'assistant',
              },
            ],
          },
        },
      ],
    });
  }),

  // Mock history API
  http.post('/api/history', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 1,
      ...body,
    });
  }),

  http.get('/api/history', ({ request }) => {
    const url = new URL(request.url);
    const recordId = url.searchParams.get('recordId');
    return HttpResponse.json({
      recordId,
      content: {},
      aiAgentType: '/test',
    });
  }),

  // Mock resume agent API
  http.post('/api/ai-resume-agent', async () => {
    return HttpResponse.json({
      overall_score: 85,
      overall_feedback: 'Good',
      sections: {
        contact_info: { score: 95 },
        experience: { score: 88 },
        education: { score: 70 },
        skills: { score: 80 },
      },
    });
  }),

  // Mock career chat agent API
  http.post('/api/ai-career-chat-agent', async () => {
    return HttpResponse.json({
      content: 'Mock career advice response',
      role: 'assistant',
    });
  }),

  // Mock career roadmap agent API
  http.post('/api/ai-career-roadmap-agent', async () => {
    return HttpResponse.json({
      recordId: 'test-record-id',
      roadmap: {
        summary: {
          headline: 'Test Career Path',
          fitAssessment: 'Good fit',
        },
        phases: [],
      },
    });
  }),
];

