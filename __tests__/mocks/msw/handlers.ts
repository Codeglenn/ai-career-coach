import { rest } from 'msw';

// Mock API handlers for MSW (compatible with msw v0.49.x)
export const handlers = [
  // Mock Inngest runs endpoint
  rest.get('*/v1/events/:runId/runs', (req, res, ctx) => {
    const { runId } = req.params as { runId?: string };
    return res(
      ctx.json({
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
      }),
    );
  }),

  // Mock history API
  rest.post('/api/history', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.json({ id: 1, ...body }));
  }),

  rest.get('/api/history', (req, res, ctx) => {
    const url = new URL(req.url.toString());
    const recordId = url.searchParams.get('recordId');
    return res(ctx.json({ recordId, content: {}, aiAgentType: '/test' }));
  }),

  // Mock resume agent API
  rest.post('/api/ai-resume-agent', async (_req, res, ctx) => {
    return res(
      ctx.json({
        overall_score: 85,
        overall_feedback: 'Good',
        sections: {
          contact_info: { score: 95 },
          experience: { score: 88 },
          education: { score: 70 },
          skills: { score: 80 },
        },
      }),
    );
  }),

  // Mock career chat agent API
  rest.post('/api/ai-career-chat-agent', async (_req, res, ctx) => {
    return res(ctx.json({ content: 'Mock career advice response', role: 'assistant' }));
  }),

  // Mock career roadmap agent API
  rest.post('/api/ai-career-roadmap-agent', async (_req, res, ctx) => {
    return res(
      ctx.json({
        recordId: 'test-record-id',
        roadmap: {
          summary: {
            headline: 'Test Career Path',
            fitAssessment: 'Good fit',
          },
          phases: [],
        },
      }),
    );
  }),
];

