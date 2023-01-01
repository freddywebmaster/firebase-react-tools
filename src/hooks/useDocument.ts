import { FirestoreService } from '../services/firestore/Firestore';
import { useEffect, useState } from 'react';

type QueryResult<T> = {
  isLoading: boolean;
  error: boolean;
  refetch: () => Promise<void>;
  mutate: FirestoreService<T>;
};

export function useDocument<State>(
  service: FirestoreService<State>,
  setState: (data: State) => void,
  id: string,
  objectCache?: State,
): QueryResult<State> {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(true);

  const getData = async () => {
    setIsLoading(true);

    const res = await service.findById(id);

    if (!res.error) setState(res.data as State);
    setError(res.error);

    setIsLoading(false);
  };

  const refetch = async () => await getData();

  useEffect(() => {
    if (objectCache) {
      if (Object.keys(objectCache).length === 0) {
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
