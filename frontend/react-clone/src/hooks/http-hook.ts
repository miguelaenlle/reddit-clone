import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeHttpRequests = useRef<any[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method: string,
      body?: { [key: string]: any },
      authToken?: string
    ) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method,
          headers: authToken ? headers : undefined,
          body: body ? JSON.stringify(body) : undefined,
          signal: httpAbortController.signal,
        });
        const responseData = await response.json();
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortController) => {
        abortController.abort();
      });
    };
  }, [activeHttpRequests.current]);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};
