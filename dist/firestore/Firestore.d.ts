import { FirebaseApp } from 'firebase/app';
import { QueryConstraint, DocumentData, Unsubscribe } from 'firebase/firestore';
import { IResponseFirestore, IFirebaseFunctions, IPopulated } from './Interfaces';
export declare class FirestoreService implements IFirebaseFunctions {
    private db;
    private readonly collection;
    constructor(app: FirebaseApp, collection: string);
    add(data: DocumentData, id?: string): Promise<IResponseFirestore>;
    findById(id: string): Promise<IResponseFirestore>;
    find(queryOptions?: QueryConstraint, populated?: IPopulated[]): Promise<IResponseFirestore>;
    delete(id: string): Promise<IResponseFirestore>;
    update(id: string, newData: DocumentData, merge?: boolean): Promise<IResponseFirestore>;
    transaction(id: string, field: string, value: number): Promise<IResponseFirestore>;
    addInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
    deleteInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
    deleteField(id: string, field: string): Promise<IResponseFirestore>;
    findDocumentRt(id: string, callBack: Function): Unsubscribe | IResponseFirestore;
    findDocumentsRt(queryOptions: QueryConstraint, callback: Function): Unsubscribe | IResponseFirestore;
    findCollectionRt(callBack: Function): Unsubscribe | IResponseFirestore;
}
