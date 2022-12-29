import { FirebaseApp } from 'firebase/app';
import { QueryConstraint, DocumentData, Unsubscribe, FirestoreSettings, DocumentSnapshot } from 'firebase/firestore';
import { IResponseFirestore, IFirebaseFunctions } from './Interfaces';
export declare class FirestoreService<T> implements IFirebaseFunctions<T> {
    private db;
    private readonly collection;
    constructor(app: FirebaseApp, collection: string, config?: FirestoreSettings);
    add(data: DocumentData, id?: string): Promise<IResponseFirestore<T>>;
    findById(id: string): Promise<IResponseFirestore<T>>;
    find<T>(queryOptions?: QueryConstraint): Promise<IResponseFirestore<T[]>>;
    delete(id: string): Promise<IResponseFirestore<string>>;
    update(id: string, newData: DocumentData, merge?: boolean): Promise<IResponseFirestore<T>>;
    transaction(id: string, field: string, value: number): Promise<IResponseFirestore<T>>;
    addInArray(id: string, field: string, data: any): Promise<IResponseFirestore<{
        error: boolean;
        message: string;
    }>>;
    deleteInArray(id: string, field: string, data: any): Promise<IResponseFirestore<{
        error: boolean;
        message: string;
    }>>;
    deleteField(id: string, field: string): Promise<IResponseFirestore<{
        error: boolean;
        message: string;
    }>>;
    documentSuscribe(id: string, callBack: (doc: DocumentSnapshot<DocumentData>) => void): Unsubscribe;
    collectionSuscribe(callBack: (collection: T[]) => void, queryOptions?: QueryConstraint): Unsubscribe;
}
