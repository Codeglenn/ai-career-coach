// Mock for ImageKit
const ImageKit = jest.fn().mockImplementation(() => ({
  upload: jest.fn().mockResolvedValue({
    url: 'https://mock-imagekit-url.com/resume.pdf',
    fileId: 'mock-file-id',
    name: 'resume.pdf',
  }),
}));

export default ImageKit;

