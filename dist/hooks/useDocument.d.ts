import { FirestoreService } from '../firestore/Firestore';
declare type QueryResult<T> = {
    isLoading: boolean;
    error: boolean;
    refetch: () => Promise<void>;
    mutate: FirestoreService<T>;
};
export declare function useDocument<State>(service: FirestoreService<State>, setState: (data: State) => void, id: string, objectCache?: State): QueryResult<State>;
export {};
