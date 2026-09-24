import { useEffect, useState } from 'react';

/**
 * Hook générique : appelle une fonction de service (ex: portfolioService.getSkills)
 * et gère automatiquement les états loading / error / data.
 * Utilisable pour n'importe quelle section connectée aux données Supabase.
 */
export function usePortfolioData(serviceFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    serviceFn()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Erreur de chargement');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [serviceFn]);

  return { data, loading, error };
}