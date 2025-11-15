import { AxiosRequestConfig } from 'axios';
export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
}
export declare class ApiClient {
    private client;
    constructor(config: ApiClientConfig);
    private setupInterceptors;
    setAuthToken(token: string): void;
    clearAuthToken(): void;
    private getAuthToken;
    private handleUnauthorized;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
export default ApiClient;
