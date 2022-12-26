import { FirestoreService } from '../services/firestore/Firestore';
import { QueryConstraint } from 'firebase/firestore';
import { useEffect } from 'react';

export async function useQueryRT<State>(
  service: FirestoreService<State>,
  cb: (data: State[]) => any,
  queryOptions?: QueryConstraint | undefined,
) {
  useEffect(() => {
    const unsuscribe = service.collectionSuscribe(cb, queryOptions);

    return () => unsuscribe();
  }, []);
}
