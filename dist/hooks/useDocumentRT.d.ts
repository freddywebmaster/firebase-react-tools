import { FirestoreService } from "../services/firestore/Firestore";
export declare function useDocumentRT<State>(service: FirestoreService<State>, id: string, cb: (data: State) => void): Promise<void>;
