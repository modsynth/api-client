# API Client

> REST API client based on Axios

Part of the [Modsynth](https://github.com/modsynth) ecosystem.

## Features

- Axios-based HTTP client
- Automatic authentication token handling
- Request/response interceptors
- TypeScript support

## Installation

```bash
npm install @modsynth/api-client
```

## Quick Start

```typescript
import ApiClient from '@modsynth/api-client';

const client = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
});

// Set auth token
client.setAuthToken('your-token');

// GET request
const users = await client.get('/users');

// POST request
const newUser = await client.post('/users', {
  name: 'John',
  email: 'john@example.com',
});

// PUT request
await client.put('/users/1', { name: 'Jane' });

// DELETE request
await client.delete('/users/1');
```

## Version

Current version: `v0.1.0`

## License

MIT
