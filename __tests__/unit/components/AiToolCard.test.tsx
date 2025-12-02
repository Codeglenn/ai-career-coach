/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AiToolCard from '@/app/(routes)/dashboard/_components/AiToolCard';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

// Mock dependencies
jest.mock('axios');
jest.mock('next/navigation');
jest.mock('@clerk/nextjs');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-v4'),
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

describe('AiToolCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useUser as jest.Mock).mockReturnValue({
      user: { id: 'test-user' },
      isLoaded: true,
      isSignedIn: true,
    });
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
  });

  const mockChatTool = {
    name: 'AI Q&A Chatbot',
    desc: 'Chat With AI Chatbot Agent',
    icon: '/chat-bot.png',
    button: "Let's Chat",
    path: '/ai-tools/ai-chatbot',
  };

  const mockResumeTool = {
    name: 'AI Resume Analyzer',
    desc: 'Improve Your Resume',
    icon: '/resume-analyzer.png',
    button: 'Analyze Now',
    path: '/ai-tools/ai-resume-analyzer',
  };

  const mockRoadmapTool = {
    name: 'Roadmap Generator',
    desc: 'Build Your Roadmap',
    icon: '/career-roadmap.png',
    button: 'Generate Now',
    path: '/ai-tools/career-roadmap-generator',
  };

  it('renders tool information correctly', () => {
    render(<AiToolCard tool={mockChatTool} />);
    
    expect(screen.getByText('AI Q&A Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Chat With AI Chatbot Agent')).toBeInTheDocument();
    expect(screen.getByText("Let's Chat")).toBeInTheDocument();
  });

  it('creates history record and navigates for chatbot tool', async () => {
    render(<AiToolCard tool={mockChatTool} />);
    
    const button = screen.getByText("Let's Chat");
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/history', {
        recordId: 'mock-uuid-v4',
        content: [],
        aiAgentType: '/ai-tools/ai-chatbot',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/ai-tools/ai-chatbot/mock-uuid-v4');
    });
  });

  it('opens resume upload dialog for resume analyzer', () => {
    render(<AiToolCard tool={mockResumeTool} />);
    
    const button = screen.getByText('Analyze Now');
    fireEvent.click(button);

    // Dialog should be opened (we'll check this through dialog visibility)
    expect(screen.getByText(/Upload Resume pdf file/i)).toBeInTheDocument();
  });

  it('opens career roadmap dialog for roadmap generator', () => {
    render(<AiToolCard tool={mockRoadmapTool} />);
    
    const button = screen.getByText('Generate Now');
    fireEvent.click(button);

    expect(screen.getByText(/Kenyan Career Roadmap Agent/i)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    render(<AiToolCard tool={mockChatTool} />);
    
    const button = screen.getByText("Let's Chat");
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
    // Router should not be called on error
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});

