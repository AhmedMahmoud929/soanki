"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ============== Query (GET-style, fetch on mount / refetch) ==============

export interface UseApiQueryOptions<TData> {
  /** Function that returns a promise of the data. */
  queryFn: () => Promise<TData>;
  /** If false, the query will not run automatically and refetch will be the only way to run it. */
  enabled?: boolean;
  /** Optional key (or deps) to re-run the query when they change. */
  queryKey?: unknown[];
  /** Callback when the query succeeds. */
  onSuccess?: (data: TData) => void;
  /** Callback when the query fails. */
  onError?: (error: Error) => void;
}

export interface UseApiQueryResult<TData> {
  /** Last successfully resolved data. */
  data: TData | undefined;
  /** Error from the last failed request. */
  error: Error | null;
  /** True while the initial fetch or a refetch is in progress. */
  isLoading: boolean;
  /** True while any fetch (initial or refetch) is in progress. */
  isFetching: boolean;
  /** True after the first successful load. */
  isSuccess: boolean;
  /** True after a failed request. */
  isError: boolean;
  /** Trigger a refetch. */
  refetch: () => Promise<void>;
}

export function useApiQuery<TData>(
  options: UseApiQueryOptions<TData>
): UseApiQueryResult<TData> {
  const { queryFn, enabled = true, queryKey = [], onSuccess, onError } = options;
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isFetching, setIsFetching] = useState(false);
  const hasFetchedOnce = useRef(false);

  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const run = useCallback(async () => {
    const fn = queryFnRef.current;
    setIsFetching(true);
    if (!hasFetchedOnce.current) setIsLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      hasFetchedOnce.current = true;
      onSuccess?.(result);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      onError?.(err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    if (enabled) run();
  }, [enabled, run, ...(queryKey ?? [])]);

  const refetch = useCallback(async () => {
    await run();
  }, [run]);

  return {
    data,
    error,
    isLoading,
    isFetching,
    isSuccess: hasFetchedOnce.current && error === null,
    isError: error !== null,
    refetch,
  };
}

// ============== Mutation (POST/PUT/DELETE-style, trigger by call) ==============

export interface UseApiMutationOptions<TData, TVariables> {
  /** Function that performs the mutation. Receives variables, returns the result. */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Callback when the mutation succeeds. */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Callback when the mutation fails. */
  onError?: (error: Error, variables: TVariables) => void;
}

export interface UseApiMutationResult<TData, TVariables> {
  /** Last successfully resolved data. */
  data: TData | undefined;
  /** Error from the last failed mutation. */
  error: Error | null;
  /** True while the mutation is in progress. */
  isLoading: boolean;
  /** True after a successful mutation. */
  isSuccess: boolean;
  /** True after a failed mutation. */
  isError: boolean;
  /** Trigger the mutation (fire-and-forget). */
  mutate: (variables: TVariables) => void;
  /** Trigger the mutation and return a promise. */
  mutateAsync: (variables: TVariables) => Promise<TData>;
  /** Reset data, error, and status. */
  reset: () => void;
}

export function useApiMutation<TData, TVariables = void>(
  options: UseApiMutationOptions<TData, TVariables>
): UseApiMutationResult<TData, TVariables> {
  const { mutationFn, onSuccess, onError } = options;
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = useCallback(
    (variables: TVariables) => {
      mutateAsync(variables).catch(() => {
        // Error already handled in mutateAsync
      });
    },
    [mutationFn, onSuccess, onError]
  );

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      try {
        const result = await mutationFn(variables);
        setData(result);
        setIsSuccess(true);
        onSuccess?.(result, variables);
        return result;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        onError?.(err, variables);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    isSuccess,
    isError: error !== null,
    mutate,
    mutateAsync,
    reset,
  };
}
