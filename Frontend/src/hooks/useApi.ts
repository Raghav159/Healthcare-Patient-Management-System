import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

// Define the base URL for our API
const API_BASE_URL = 'http://localhost:8000';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface ApiHook<T> extends ApiState<T> {
  fetchData: (config?: AxiosRequestConfig) => Promise<T | null>;
  postData: <R>(url: string, data: R, config?: AxiosRequestConfig) => Promise<T | null>;
  putData: <R>(url: string, data: R, config?: AxiosRequestConfig) => Promise<T | null>;
  deleteData: (url: string, config?: AxiosRequestConfig) => Promise<boolean>;
}

export function useApi<T>(initialUrl?: string): ApiHook<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (config?: AxiosRequestConfig): Promise<T | null> => {
      if (!initialUrl && !config?.url) {
        console.error('No URL provided for API request');
        return null;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await api.request<T>({
          method: 'GET',
          url: initialUrl,
          ...config,
        });

        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          error: error as Error,
        });
        return null;
      }
    },
    [initialUrl]
  );

  const postData = useCallback(
    async <R>(
      url: string,
      data: R,
      config?: AxiosRequestConfig
    ): Promise<T | null> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await api.post<T>(url, data, config);

        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          error: error as Error,
        });
        return null;
      }
    },
    []
  );

  const putData = useCallback(
    async <R>(
      url: string,
      data: R,
      config?: AxiosRequestConfig
    ): Promise<T | null> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await api.put<T>(url, data, config);

        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          error: error as Error,
        });
        return null;
      }
    },
    []
  );

  const deleteData = useCallback(
    async (url: string, config?: AxiosRequestConfig): Promise<boolean> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        await api.delete(url, config);

        setState({
          data: null,
          isLoading: false,
          error: null,
        });

        return true;
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          error: error as Error,
        });
        return false;
      }
    },
    []
  );

  return {
    ...state,
    fetchData,
    postData,
    putData,
    deleteData,
  };
}