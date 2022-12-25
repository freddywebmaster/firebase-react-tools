import { DocumentData, DocumentSnapshot, QueryConstraint, Unsubscribe } from 'firebase/firestore';

export interface IResponseFirestore<T> {
  error: boolean;
  message: string;
  data?: T;
}

export interface IPopulated {
  field: string;
  collection: string;
  isArray?: boolean;
}

export interface IFirebaseFunctions<T> {
  add(data: DocumentData): Promise<IResponseFirestore<T>>;
  findById(id: string): Promise<IResponseFirestore<T>>;
  find<T>(queryOptions?: QueryConstraint): Promise<IResponseFirestore<T[]>>;
  delete(id: string): Promise<IResponseFirestore<string>>;
  update(id: string, newData: DocumentData, merge: boolean): Promise<IResponseFirestore<T>>;
  transaction(id: string, field: string, value: number): Promise<IResponseFirestore<T>>;
  addInArray(
    id: string,
    field: string,
    data: DocumentData,
  ): Promise<IResponseFirestore<{ error: boolean; message: string }>>;
  deleteInArray(
    id: string,
    field: string,
    data: DocumentData,
  ): Promise<IResponseFirestore<{ error: boolean; message: string }>>;
  deleteField(id: string, field: string): Promise<IResponseFirestore<{ error: boolean; message: string }>>;
  documentSuscribe(id: string, callBack: (doc: DocumentSnapshot<DocumentData>) => void): Unsubscribe;
  collectionSuscribe(callBack: (results: T[]) => void, queryOptions?: QueryConstraint): Unsubscribe;
}
