import { FirebaseApp } from 'firebase/app';
import { QueryConstraint, DocumentData, Unsubscribe, DocumentSnapshot } from 'firebase/firestore';
import { IResponseFirestore, IFirebaseFunctions } from './Interfaces';
export declare class FirestoreService implements IFirebaseFunctions {
    private db;
    private readonly collection;
    constructor(app: FirebaseApp, collection: string);
    add(data: DocumentData, id?: string): Promise<IResponseFirestore>;
    findById(id: string): Promise<IResponseFirestore>;
    find(queryOptions?: QueryConstraint): Promise<IResponseFirestore>;
    delete(id: string): Promise<IResponseFirestore>;
    update(id: string, newData: DocumentData, merge?: boolean): Promise<IResponseFirestore>;
    transaction(id: string, field: string, value: number): Promise<IResponseFirestore>;
    addInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
    deleteInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
    deleteField(id: string, field: string): Promise<IResponseFirestore>;
    documentSuscribe(id: string, callBack: (doc: DocumentSnapshot<DocumentData>) => void): Unsubscribe;
    collectionSuscribe(callBack: (collection: DocumentData[]) => void, queryOptions?: QueryConstraint): Unsubscribe;
}
