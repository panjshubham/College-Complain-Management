import { toast } from 'sonner';

/**
 * A wrapper around the native fetch API to include cold-start detection.
 * If a request takes longer than 2.5 seconds, it shows a toast notification.
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
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    if (toastId) {
      toast.dismiss(toastId);
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (toastId) {
      toast.dismiss(toastId);
    }
    throw error;
  }
}
