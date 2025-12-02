import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AiToolCard from '@/app/(routes)/dashboard/_components/AiToolCard';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

jest.mock('axios');
jest.mock('next/navigation');
jest.mock('@clerk/nextjs');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-id-123'),
}));

const mockRouter = {
  push: jest.fn(),
};

describe('AiToolCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useUser as jest.Mock).mockReturnValue({
      user: { id: 'user-123' },
      isLoaded: true,
      isSignedIn: true,
    });
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
  });

  const mockChatTool = {
    name: 'AI Q&A Chatbot',
    desc: 'Chat with AI',
    icon: '/chat-bot.png',
    button: "Let's Chat",
    path: '/ai-tools/ai-chatbot',
  };

  it('displays tool name and description', () => {
    render(<AiToolCard tool={mockChatTool} />);
    
    expect(screen.getByText('AI Q&A Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Chat with AI')).toBeInTheDocument();
  });

  it('shows tool button', () => {
    render(<AiToolCard tool={mockChatTool} />);
    
    expect(screen.getByText("Let's Chat")).toBeInTheDocument();
  });

  it('creates history and navigates on button click', async () => {
    render(<AiToolCard tool={mockChatTool} />);
    
    const button = screen.getByText("Let's Chat");
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });
});

