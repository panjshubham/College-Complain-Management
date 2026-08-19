import { toast } from 'sonner';

/**
 * A wrapper around the native fetch API with automatic JWT injection,
 * base URL handling, cold-start detection, and request logging.
 */
export async function apiClient(url, options = {}) {
  let toastId = null;
  const timeoutId = setTimeout(() => {
    toastId = toast.loading('Waking up server... please allow up to 30 seconds.', {
      id: 'cold-start',
      duration: 30000,
    });
  }, 2500);

  try {
    const token = localStorage.getItem('auth_token');
    const headers = {
      ...(options.headers || {}),
    };

    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const baseURL = import.meta.env.VITE_API_URL || '';
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

    console.log(`[API Request] ${options.method || 'GET'} ${fullUrl}`, { hasToken: !!token });

    const response = await fetch(fullUrl, {
      ...options,
      headers
    });

    clearTimeout(timeoutId);
    if (toastId) {
      toast.dismiss(toastId);
    }

    console.log(`[API Response] ${response.status} from ${fullUrl}`);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (toastId) {
      toast.dismiss(toastId);
    }
    console.error(`[API Error] ${url}:`, error);
    throw error;
  }
}
