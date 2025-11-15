# API Client

[![npm version](https://badge.fury.io/js/%40modsynth%2Fapi-client.svg)](https://www.npmjs.com/package/@modsynth/api-client)
[![npm downloads](https://img.shields.io/npm/dm/@modsynth/api-client.svg)](https://www.npmjs.com/package/@modsynth/api-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> REST API client based on Axios

Part of the [Modsynth](https://github.com/modsynth) ecosystem.

## Features

- Axios-based HTTP client
- Automatic authentication token handling
- Request/response interceptors
- ✨ **React Hooks**: `useApiClient`, `useApiRequest` (v0.2.0)
- ✨ **Retry Logic**: Exponential backoff (v0.2.0)
- ✨ **Utilities**: `buildQueryString`, `isApiError` (v0.2.0)
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

## What's New in v0.2.0

- **React Hooks**: `useApiClient()` and `useApiRequest()` with loading/error states
- **Retry Logic**: `retryRequest()` with exponential backoff
- **Utilities**: Query string builder and error type checker

## Version

Current version: `v0.2.0`

## License

MIT
