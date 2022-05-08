import { User } from 'firebase/auth';
export interface IUseAuth {
    user: User | null;
    loading: boolean;
}
export declare function useAuth(): IUseAuth;
