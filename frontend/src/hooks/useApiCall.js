import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

// Custom hook to manage API calls with loading and error states
export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// Function to execute an API call with optional success and error callbacks
  const execute = useCallback(async (apiFunction, onSuccess, onError) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction();
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      if (onError) {
        onError(err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};
