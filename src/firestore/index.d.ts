import { FirebaseApp } from 'firebase/app';
import { DocumentData, QueryConstraint, Unsubscribe } from 'firebase/firestore';
import { IResponseFirestore } from './Interfaces'

export class FirestoreService {
  constructor(app: FirebaseApp, collection: string);
  private db;
  private readonly collection;
  public add(data: DocumentData, id?: string): Promise<IResponseFirestore>;
  public findById(id: string): Promise<IResponseFirestore>;
  public find(queryOptions?: QueryConstraint): Promise<IResponseFirestore>;
  public delete(id: string): Promise<IResponseFirestore>;
  public update(id: string, newData: DocumentData, merge?: boolean): Promise<IResponseFirestore>;
  public transaction(id: string, field: string, value: number): Promise<IResponseFirestore>;
  public addInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
  public deleteInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore>;
  public deleteField(id: string, field: string): Promise<IResponseFirestore>;
  public findDocumentRt(id: string, callBack: Function): Unsubscribe | IResponseFirestore;
  public findDocumentsRt(queryOptions: QueryConstraint, callback: Function): Unsubscribe | IResponseFirestore;
  public findCollectionRt(callBack: Function): Unsubscribe | IResponseFirestore;
}
