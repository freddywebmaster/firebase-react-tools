import { DocumentData, DocumentSnapshot, QueryConstraint, Unsubscribe } from 'firebase/firestore';
export interface IResponseFirestore {
    error: boolean;
    message: string;
    data?: DocumentData;
}
export interface IPopulated {
    field: string;
    collection: string;
    isArray?: boolean;
}
export interface IFirebaseFunctions {
    add(data: DocumentData): Promise<IResponseFirestore>;
    findById(id: string): Promise<IResponseFirestore>;
    find(queryOptions?: QueryConstraint): Promise<IResponseFirestore>;
    delete(id: string): Promise<IResponseFirestore>;
    update(id: string, newData: DocumentData, merge: boolean): Promise<IResponseFirestore>;
    transaction(id: string, field: string, value: number): Promise<IResponseFirestore>;
    addInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
    deleteInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
    deleteField(id: string, field: string): Promise<IResponseFirestore>;
    documentSuscribe(id: string, callBack: (doc: DocumentSnapshot<DocumentData>) => void): Unsubscribe;
    collectionSuscribe(callBack: (collection: DocumentData[]) => void, queryOptions?: QueryConstraint): Unsubscribe;
}
