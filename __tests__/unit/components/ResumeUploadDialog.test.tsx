import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeUploadDialog from '@/app/(routes)/dashboard/_components/ResumeUploadDialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('next/navigation');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'record-123'),
}));

const mockRouter = {
  push: jest.fn(),
};

describe('ResumeUploadDialog Component', () => {
  const mockSetOpenDialog = jest.fn();
  let mockFile: File;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    mockFile = new File(['pdf content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        overall_score: 85,
      },
    });
  });

  it('shows dialog title when open', () => {
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    expect(screen.getByText(/Upload Resume pdf file/i)).toBeInTheDocument();
  });

  it('hides dialog when closed', () => {
    render(
      <ResumeUploadDialog
        openResumeUpload={false}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    expect(screen.queryByText(/Upload Resume pdf file/i)).not.toBeInTheDocument();
  });

  it('displays file name after upload', async () => {
    const user = userEvent.setup();
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const fileInput = screen.getByLabelText(/Click here to upload pdf file/i) as HTMLInputElement;
    await user.upload(fileInput, mockFile);

    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });

  it('disables upload button without file', () => {
    render(
      <ResumeUploadDialog
        openResumeUpload={true}
        setOpenResumeDialog={mockSetOpenDialog}
      />
    );

    const uploadButton = screen.getByRole('button', { name: /Upload & Analyze/i });
    expect(uploadButton).toBeDisabled();
  });

  it('navigates after successful upload', async () => {
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
      expect(mockRouter.push).toHaveBeenCalled();
      expect(mockSetOpenDialog).toHaveBeenCalledWith(false);
    });
  });

  it('closes dialog on cancel', async () => {
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

