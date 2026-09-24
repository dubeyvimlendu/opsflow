import { useEffect, useState } from 'react';
import { ApiError, formatErrorDetail } from '../api/client';

// Runs `fetchFn` once on mount and exposes {data, error, loading}.
// Used so a single failing report section doesn't take down the rest
// of the Reports page — each section fetches and fails independently.
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? formatErrorDetail(err.detail) || err.message
            : 'Could not reach the OpsFlow backend.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}
