import { FirestoreService } from "firebase-react-tools";
export declare function useDocumentRT<State>(service: FirestoreService<State>, id: string, cb: (data: State) => void): Promise<void>;
