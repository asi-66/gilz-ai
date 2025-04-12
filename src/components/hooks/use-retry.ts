
import { useState, useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  backoffFactor?: number;
}

/**
 * A hook that provides retry functionality for API calls or other async operations
 * @param asyncFn - The async function to retry
 * @param options - Configuration options for the retry behavior
 * @returns Object containing retry function, loading state, and error state
 */
export function useRetry<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  options: RetryOptions = {}
) {
  const { maxRetries = 3, initialDelay = 1000, backoffFactor = 2 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeWithRetry = useCallback(
    async (...args: Args): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      
      let retries = 0;
      let delay = initialDelay;

      while (retries <= maxRetries) {
        try {
          const result = await asyncFn(...args);
          setIsLoading(false);
          return result;
        } catch (err) {
          if (retries === maxRetries) {
            setError(err as Error);
            setIsLoading(false);
            return null;
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Exponential backoff
          delay *= backoffFactor;
          retries++;
        }
      }

      // Shouldn't reach here but TypeScript needs a return
      setIsLoading(false);
      return null;
    },
    [asyncFn, maxRetries, initialDelay, backoffFactor]
  );

  return { execute: executeWithRetry, isLoading, error };
}
