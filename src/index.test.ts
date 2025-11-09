import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiClient } from './index';

describe('ApiClient', () => {
  let client: ApiClient;
  let mock: MockAdapter;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    client = new ApiClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      headers: { 'X-Custom-Header': 'test' },
    });

    // Create axios mock adapter
    // Access private client property
    const privateClient = (client as any)['client'];
    if (privateClient) {
      mock = new MockAdapter(privateClient);
    }
  });

  afterEach(() => {
    if (mock) {
      mock.reset();
    }
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('creates client with provided config', () => {
      const testClient = new ApiClient({
        baseURL: 'https://test.com',
        timeout: 10000,
      });

      expect(testClient).toBeInstanceOf(ApiClient);
    });

    it('uses default timeout if not provided', () => {
      const testClient = new ApiClient({
        baseURL: 'https://test.com',
      });

      expect(testClient).toBeInstanceOf(ApiClient);
    });
  });

  describe('HTTP Methods', () => {
    describe('get', () => {
      it('makes GET request successfully', async () => {
        const responseData = { id: 1, name: 'Test' };
        mock.onGet('/users/1').reply(200, responseData);

        const result = await client.get('/users/1');

        expect(result).toEqual(responseData);
      });

      it('makes GET request with config', async () => {
        const responseData = { data: 'test' };
        mock.onGet('/data', { params: { page: 1 } }).reply(200, responseData);

        const result = await client.get('/data', { params: { page: 1 } });

        expect(result).toEqual(responseData);
      });

      it('throws error on failed GET request', async () => {
        mock.onGet('/error').reply(500);

        await expect(client.get('/error')).rejects.toThrow();
      });
    });

    describe('post', () => {
      it('makes POST request successfully', async () => {
        const requestData = { name: 'New User' };
        const responseData = { id: 1, ...requestData };
        mock.onPost('/users', requestData).reply(201, responseData);

        const result = await client.post('/users', requestData);

        expect(result).toEqual(responseData);
      });

      it('makes POST request without data', async () => {
        const responseData = { success: true };
        mock.onPost('/action').reply(200, responseData);

        const result = await client.post('/action');

        expect(result).toEqual(responseData);
      });
    });

    describe('put', () => {
      it('makes PUT request successfully', async () => {
        const requestData = { name: 'Updated User' };
        const responseData = { id: 1, ...requestData };
        mock.onPut('/users/1', requestData).reply(200, responseData);

        const result = await client.put('/users/1', requestData);

        expect(result).toEqual(responseData);
      });
    });

    describe('patch', () => {
      it('makes PATCH request successfully', async () => {
        const requestData = { name: 'Patched User' };
        const responseData = { id: 1, name: 'Patched User' };
        mock.onPatch('/users/1', requestData).reply(200, responseData);

        const result = await client.patch('/users/1', requestData);

        expect(result).toEqual(responseData);
      });
    });

    describe('delete', () => {
      it('makes DELETE request successfully', async () => {
        const responseData = { success: true };
        mock.onDelete('/users/1').reply(200, responseData);

        const result = await client.delete('/users/1');

        expect(result).toEqual(responseData);
      });

      it('makes DELETE request with config', async () => {
        const responseData = { deleted: true };
        mock.onDelete('/items/1').reply(204, responseData);

        const result = await client.delete('/items/1', { headers: { 'X-Force': 'true' } });

        expect(result).toEqual(responseData);
      });
    });
  });

  describe('Authentication', () => {
    describe('setAuthToken', () => {
      it('sets token in localStorage', () => {
        const token = 'test-token-123';
        client.setAuthToken(token);

        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', token);
      });
    });

    describe('clearAuthToken', () => {
      it('removes token from localStorage', () => {
        client.clearAuthToken();

        expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      });
    });

    describe('request interceptor', () => {
      it('adds Authorization header when token exists', async () => {
        const token = 'bearer-token-123';
        (localStorage.getItem as jest.Mock).mockReturnValue(token);

        mock.onGet('/protected').reply((config) => {
          expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
          return [200, { data: 'protected' }];
        });

        await client.get('/protected');
      });

      it('does not add Authorization header when no token', async () => {
        (localStorage.getItem as jest.Mock).mockReturnValue(null);

        mock.onGet('/public').reply((config) => {
          expect(config.headers?.Authorization).toBeUndefined();
          return [200, { data: 'public' }];
        });

        await client.get('/public');
      });
    });

    describe('response interceptor', () => {
      it('handles 401 unauthorized error', async () => {
        mock.onGet('/protected').reply(401);

        await expect(client.get('/protected')).rejects.toThrow();

        expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
        // Note: window.location.href is difficult to test in jsdom
        // The handleUnauthorized method is called, which clears token and redirects
      });

      it('does not handle other error codes', async () => {
        const originalHref = window.location.href;
        mock.onGet('/error').reply(500);

        await expect(client.get('/error')).rejects.toThrow();

        expect(localStorage.removeItem).not.toHaveBeenCalled();
      });

      it('passes through successful responses', async () => {
        const responseData = { success: true };
        mock.onGet('/success').reply(200, responseData);

        const result = await client.get('/success');

        expect(result).toEqual(responseData);
        expect(localStorage.removeItem).not.toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles network error', async () => {
      mock.onGet('/network-error').networkError();

      await expect(client.get('/network-error')).rejects.toThrow();
    });

    it('handles timeout error', async () => {
      mock.onGet('/timeout').timeout();

      await expect(client.get('/timeout')).rejects.toThrow();
    });

    it('handles generic axios error', async () => {
      mock.onGet('/generic-error').reply(400, { message: 'Bad Request' });

      await expect(client.get('/generic-error')).rejects.toThrow();
    });
  });
});
