import api from '@/lib/api.utils';
import { useState } from 'react';
import { toast } from 'sonner';

type Method = 'GET' | 'POST';

type UseApiRequestOptions<T> = {
  method: Method;
  url: string;
  passport?: string;
  provider?: string;
  showToast?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
};

export function useApiRequest<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = async (
    options: UseApiRequestOptions<T>,
    payload?: Record<string, unknown>
  ) => {
    const { method, url, showToast = true, onSuccess, onError } = options;

    setLoading(true);
    setError(null);

    try {
      const response =
        method === 'GET' ? await api.get(url) : await api.post(url, payload);

      setData(response.data);
      if (showToast) toast.success('Request successful');
      if (onSuccess) onSuccess(response.data);
      return response;
    } catch (err: any) {
      const message = err.message || 'Request failed';
      setError(message);
      if (showToast) toast.error(message);
      if (onError) onError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { request, data, error, loading };
}
