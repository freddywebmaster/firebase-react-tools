import { FirestoreService } from '../services/firestore/Firestore';
import { QueryConstraint } from 'firebase/firestore';
export declare function useQueryRT<State>(service: FirestoreService<State>, cb: (data: State[]) => any, queryOptions?: QueryConstraint | undefined): Promise<void>;
