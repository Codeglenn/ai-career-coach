import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeUploadDialog from '@/app/(routes)/dashboard/_components/ResumeUploadDialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('axios');
jest.mock('next/navigation');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-resume-uuid'),
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

describe('ResumeUploadDialog', () => {
  const mockSetOpenDialog = jest.fn();
  let mockFile: File;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    // Create a mock PDF file
    mockFile = new File(['mock pdf content'], 'test-resume.pdf', {
      type: 'application/pdf',
    });
    
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        overall_score: 85,
        overall_feedback: 'Good',
      },
    });
  });

  it('renders dialog when open', () => {
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    expect(screen.getByText(/Upload Resume pdf file/i)).toBeInTheDocument();
    expect(screen.getByText(/Click here to upload pdf file/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ResumeUploadDialog
        openResumeUpload={false}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    expect(screen.queryByText(/Upload Resume pdf file/i)).not.toBeInTheDocument();
  });

  it('allows file selection and displays file name', async () => {
    const user = userEvent.setup();
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const fileInput = screen.getByLabelText(/Click here to upload pdf file/i) as HTMLInputElement;
    
    await user.upload(fileInput, mockFile);

    expect(screen.getByText('test-resume.pdf')).toBeInTheDocument();
  });

  it('disables upload button when no file is selected', () => {
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const uploadButton = screen.getByRole('button', { name: /Upload & Analyze/i });
    expect(uploadButton).toBeDisabled();
  });

  it('enables upload button when file is selected', async () => {
    const user = userEvent.setup();
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const fileInput = screen.getByLabelText(/Click here to upload pdf file/i);
    await user.upload(fileInput, mockFile);

    const uploadButton = screen.getByRole('button', { name: /Upload & Analyze/i });
    expect(uploadButton).not.toBeDisabled();
  });

  it('uploads file and navigates to report page on success', async () => {
    const user = userEvent.setup();
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const fileInput = screen.getByLabelText(/Click here to upload pdf file/i);
    await user.upload(fileInput, mockFile);

    const uploadButton = screen.getByRole('button', { name: /Upload & Analyze/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/ai-resume-agent',
        expect.any(FormData)
      );
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/ai-tools/ai-resume-analyzer/mock-resume-uuid');
      expect(mockSetOpenDialog).toHaveBeenCalledWith(false);
    });
  });

  it('shows loading state during upload', async () => {
    const user = userEvent.setup();
    (axios.post as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100))
    );

    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const fileInput = screen.getByLabelText(/Click here to upload pdf file/i);
    await user.upload(fileInput, mockFile);

    const uploadButton = screen.getByRole('button', { name: /Upload & Analyze/i });
    await user.click(uploadButton);

    // Button should show loading spinner
    expect(uploadButton).toBeDisabled();
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockSetOpenDialog).toHaveBeenCalledWith(false);
  });
});

