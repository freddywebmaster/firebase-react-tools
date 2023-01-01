import { FirestoreService } from '../services/firestore/Firestore';
import { QueryConstraint } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type OptionsQuery = {
  queryOptions?: QueryConstraint | undefined;
};

type QueryResult<T> = {
  isLoading: boolean;
  error: boolean;
  refetch: () => Promise<void>;
  mutate: FirestoreService<T>;
};

export function useQuery<State>(
  service: FirestoreService<State>,
  setState: (data: State[]) => void,
  options?: OptionsQuery,
  arrayCache?: State[],
): QueryResult<State> {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const getData = async () => {
    setIsLoading(true);

    const res = await service.find(options?.queryOptions);

    if (!res.error) setState(res.data as State[]);
    setError(res.error);

    setIsLoading(false);
  };

  const refetch = async () => await getData();

  useEffect(() => {
    if (arrayCache) {
      if (arrayCache.length === 0) {
        getData();
      } else {
        setIsLoading(false);
      }
    } else {
      getData();
    }
  }, []);

  return {
    isLoading,
    error,
    refetch,
    mutate: service,
  };
}
