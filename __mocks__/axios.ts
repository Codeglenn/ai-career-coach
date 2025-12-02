// Mock for axios
const axios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  create: jest.fn(() => axios),
  defaults: {
    headers: {
      common: {},
    },
  },
};

export default axios;

