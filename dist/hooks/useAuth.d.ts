import { User } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
export interface IUseAuth {
    user: User | null;
    loading: boolean;
}
export declare function useAuth(app: FirebaseApp): IUseAuth;
