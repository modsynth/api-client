import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiClient } from './index';

export interface UseApiClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export function useApiClient(options: UseApiClientOptions) {
  const clientRef = useRef<ApiClient | null>(null);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new ApiClient(options);
    }
  }, [options.baseURL]);

  return clientRef.current;
}

export interface UseApiRequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApiRequest<T = any>(
  requestFn: () => Promise<T>
): UseApiRequestState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await requestFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [requestFn]);

  return {
    ...state,
    refetch: execute,
  };
}
