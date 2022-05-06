import { DocumentData, QueryConstraint } from "firebase/firestore";

export interface IResponse {
  error: boolean;
  message: string;
  data?: DocumentData;
}

export interface FirebaseFunctions {
  add(data: DocumentData): Promise<IResponse>;
  findById(id: string): Promise<IResponse>;
  find(queryOptions?: QueryConstraint): Promise<IResponse>;
  delete(id: string): Promise<IResponse>;
  update(id: string, newData: DocumentData, merge: boolean): Promise<IResponse>;
  transaction(id: string, field: string, value: number): Promise<IResponse>;
  addInArray(id: string, field: string, data: DocumentData): Promise<IResponse>;
  deleteInArray(
    id: string,
    field: string,
    data: DocumentData
  ): Promise<IResponse>;
  deleteField(id: string, field: string): Promise<IResponse>;
}
