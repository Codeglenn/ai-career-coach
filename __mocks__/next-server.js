// Minimal mock for `next/server` used in tests
class NextRequest {
  constructor(url, init = {}) {
    this.url = typeof url === 'string' ? url : (url && url.url) || '';
    this.method = init.method || 'GET';
    this.headers = init.headers || {};
    this.body = init.body;
  }

  async json() {
    if (!this.body) return {};
    try {
      return JSON.parse(this.body);
    } catch (e) {
      return this.body;
    }
  }
  async formData() {
    // If body is a FormData-like object, return it. Otherwise return an empty FormData-like object
    if (this.body && typeof this.body.get === 'function') return this.body;
    return {
      get: () => null,
    };
  }
}

const NextResponse = {
  json(payload, init = {}) {
    return {
      json: async () => payload,
      status: init.status || 200,
    };
  },
};

module.exports = { NextRequest, NextResponse };
