import { FirebaseApp } from "firebase/app";
import { Unsubscribe } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  addDoc,
  collection as Col,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  QueryConstraint,
  getDocs,
  updateDoc,
  increment,
  DocumentData,
  arrayUnion,
  arrayRemove,
  deleteField,
  onSnapshot,
} from "firebase/firestore";
import { IResponse, FirebaseFunctions } from "./Interfaces";

export class FirestoreService implements FirebaseFunctions {
  private db: Firestore;
  readonly collection: string;

  constructor(collection: string, app: FirebaseApp) {
    this.db = getFirestore(app);
    this.collection = collection;
  }

  async add(data: DocumentData, id?: string): Promise<IResponse> {
    try {
      if (!id) {
        const docRef = await addDoc(Col(this.db, this.collection), data);
        data._id = docRef.id;
        return {
          data,
          message: `document created with id: ${docRef.id}`,
          error: false,
        };
      } else {
        await setDoc(doc(this.db, this.collection, id), data, { merge: true });
        data._id = id;
        return {
          data,
          message: `document created with id: ${id}`,
          error: false,
        };
      }
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  async findById(id: string): Promise<IResponse> {
    try {
      const docRef = doc(this.db, this.collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let result = docSnap.data();
        result._id = docSnap.id;
        return { message: "Doc Exist", data: result, error: false };
      } else {
        return { error: true, message: "Doc not found" };
      }
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  async find(queryOptions?: QueryConstraint): Promise<IResponse> {
    if (!queryOptions) {
      /** GET ALL */
      try {
        const querySnapshot = await getDocs(Col(this.db, this.collection));
        const result: Array<{}> = [];
        await querySnapshot.forEach((doc) => {
          let item = doc.data();
          item._id = doc.id;
          result.push(item);
        });

        return {
          message: "query executed success",
          data: result,
          error: false,
        };
      } catch (e) {
        return { error: true, message: (e as Error).message };
      }
    } else {
      try {
        const q = query(Col(this.db, this.collection), queryOptions);

        const querySnapshot = await getDocs(q);

        const result: Array<{}> = [];

        await querySnapshot.forEach((doc) => {
          let item = doc.data();
          item.id = doc.id;
          result.push(item);
        });

        return {
          message: "query executed success",
          data: result,
          error: false,
        };
      } catch (e) {
        return { error: true, message: (e as Error).message };
      }
    }
  }

  async delete(id: string): Promise<IResponse> {
    try {
      await deleteDoc(doc(this.db, this.collection, id));
      return { data: { id }, message: `doc deleted: ${id}`, error: false };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  async update(
    id: string,
    newData: DocumentData,
    merge: boolean = true
  ): Promise<IResponse> {
    try {
      const docRef = doc(this.db, this.collection, id);
      setDoc(docRef, newData, { merge });
      newData._id = id;
      return { data: newData, message: `Doc updated ${id}`, error: false };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  async transaction(
    id: string,
    field: string,
    value: number
  ): Promise<IResponse> {
    try {
      const docRef = doc(this.db, this.collection, id);

      await updateDoc(docRef, {
        [field]: increment(value),
      });
      return { error: false, message: "transaction success" };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  async addInArray(
    id: string,
    field: string,
    data: DocumentData
  ): Promise<IResponse> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: arrayUnion(data),
      });

      return {
        error: false,
        message: "data added to array success",
        data: { id: docRef.id },
      };
    } catch (e) {
      return { error: true, message: (e as Error).message } as IResponse;
    }
  }
  async deleteInArray(
    id: string,
    field: string,
    data: DocumentData
  ): Promise<IResponse> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: arrayRemove(data),
      });

      return {
        error: false,
        message: "data removed of array success",
        data: { id: docRef.id },
      };
    } catch (e) {
      return { error: true, message: (e as Error).message } as IResponse;
    }
  }

  async deleteField(id: string, field: string): Promise<IResponse> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: deleteField(),
      });
      return { error: false, message: "field deleted", data: { id } };
    } catch (e) {
      return { error: true, message: (e as Error).message } as IResponse;
    }
  }

  findDocumentRt(col: string, id: string, callBack: Function) {
    try {
      return onSnapshot(doc(this.db, col, id), function (doc) {
        callBack(doc.data());
      });
    } catch (e) {
      return { error: true, message: (e as Error).message } as IResponse;
    }
  }

  findDocumentsRt(queryOptions: QueryConstraint, callback: Function) {
    try {
      const q = query(Col(this.db, this.collection), queryOptions);
      return onSnapshot(q, (querySnapshot) => {
        const result: Array<any> = [];
        querySnapshot.forEach((doc) => {
          let item = doc.data();
          item.id = doc.id;
          result.push(item);
        });
        callback(result);
      });
    } catch (e) {
      return { error: true, message: (e as Error).message } as IResponse;
    }
  }

  findCollectionRt(callBack: Function): Unsubscribe | IResponse {
    try {
      const q = query(Col(this.db, this.collection));
      return onSnapshot(q, (querySnapshot) => {
        const result: Array<any> = [];
        querySnapshot.forEach((doc) => {
          let item = doc.data();
          item.id = doc.id;
          result.push(item);
        });
        callBack(result);
      });
    } catch (e) {
      return { error: true, message: (e as Error).message } as IResponse;
    }
  }
}
