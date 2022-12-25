import { FirestoreService } from '../services/firestore/Firestore';
import { QueryConstraint } from 'firebase/firestore';
declare type OptionsQuery = {
    queryOptions?: QueryConstraint | undefined;
};
declare type QueryResult<T> = {
    isLoading: boolean;
    error: boolean;
    refetch: () => Promise<void>;
    mutate: FirestoreService<T>;
};
export declare function useQuery<State>(service: FirestoreService<State>, setState: (data: State[]) => void, options?: OptionsQuery, arrayCache?: State[]): QueryResult<State>;
export {};
