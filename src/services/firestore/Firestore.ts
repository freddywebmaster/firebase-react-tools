import { FirebaseApp } from 'firebase/app';
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
  Unsubscribe,
  initializeFirestore,
  FirestoreSettings,
  DocumentSnapshot,
} from 'firebase/firestore';
import { IResponseFirestore, IFirebaseFunctions } from './Interfaces';

export class FirestoreService<T> implements IFirebaseFunctions<T> {
  private db: Firestore;
  private readonly collection: string;

  constructor(app: FirebaseApp, collection: string, config?: FirestoreSettings) {
    this.db = config ? initializeFirestore(app, config) : getFirestore(app);
    this.collection = collection;
  }

  public async add(data: DocumentData, id?: string): Promise<IResponseFirestore<T>> {
    try {
      if (!id) {
        const docRef = await addDoc(Col(this.db, this.collection), data);
        data.id = docRef.id;
        return {
          data: data as T,
          message: `document created with id: ${docRef.id}`,
          error: false,
        };
      } else {
        await setDoc(doc(this.db, this.collection, id), data, { merge: true });
        data.id = id;
        return {
          data: data as T,
          message: `document created with id: ${id}`,
          error: false,
        };
      }
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async findById(id: string): Promise<IResponseFirestore<T>> {
    try {
      const docRef = doc(this.db, this.collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let result = docSnap.data();
        result.id = docSnap.id;
        return { message: 'Doc Exist', data: result as T, error: false };
      } else {
        return { error: true, message: 'Doc not found' };
      }
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async find<T>(queryOptions?: QueryConstraint): Promise<IResponseFirestore<T[]>> {
    if (!queryOptions) {
      /** GET ALL */
      try {
        const querySnapshot = await getDocs(Col(this.db, this.collection));
        const result: T[] = [];
        await querySnapshot.forEach((doc) => {
          let item = doc.data() as any;
          item.id = doc.id;
          result.push(item);
        });

        return {
          message: 'query executed success',
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

        const result: T[] = [];

        await querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          result.push(item as T);
        });

        return {
          message: 'query executed success',
          data: result,
          error: false,
        };
      } catch (e) {
        return { error: true, message: (e as Error).message };
      }
    }
  }

  public async delete(id: string): Promise<IResponseFirestore<string>> {
    try {
      await deleteDoc(doc(this.db, this.collection, id));
      return { data: id, message: `doc deleted: ${id}`, error: false };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async update(id: string, newData: DocumentData, merge: boolean = true): Promise<IResponseFirestore<T>> {
    try {
      const docRef = doc(this.db, this.collection, id);
      setDoc(docRef, newData, { merge });
      newData.id = id;
      return { data: newData as T, message: `Doc updated ${id}`, error: false };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async transaction(id: string, field: string, value: number): Promise<IResponseFirestore<T>> {
    try {
      const docRef = doc(this.db, this.collection, id);

      await updateDoc(docRef, {
        [field]: increment(value),
      });
      return { error: false, message: 'transaction success' };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async addInArray(
    id: string,
    field: string,
    data: any,
  ): Promise<IResponseFirestore<{ error: boolean; message: string }>> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: arrayUnion(data),
      });

      return {
        error: false,
        message: 'data added to array success',
      };
    } catch (e) {
      return {
        error: true,
        message: (e as Error).message,
      };
    }
  }
  public async deleteInArray(
    id: string,
    field: string,
    data: any,
  ): Promise<IResponseFirestore<{ error: boolean; message: string }>> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: arrayRemove(data),
      });

      return {
        error: false,
        message: 'data removed of array success',
      };
    } catch (e) {
      return {
        error: true,
        message: (e as Error).message,
      };
    }
  }

  public async deleteField(
    id: string,
    field: string,
  ): Promise<IResponseFirestore<{ error: boolean; message: string }>> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: deleteField(),
      });
      return { error: false, message: 'field deleted' };
    } catch (e) {
      return {
        error: true,
        message: (e as Error).message,
      };
    }
  }

  public documentSuscribe(id: string, callBack: (doc: DocumentSnapshot<DocumentData>) => void): Unsubscribe {
    return onSnapshot(doc(this.db, this.collection, id), function (doc) {
      callBack(doc);
    });
  }

  public collectionSuscribe(callBack: (collection: T[]) => void, queryOptions?: QueryConstraint): Unsubscribe {
    const q = queryOptions ? query(Col(this.db, this.collection), queryOptions) : query(Col(this.db, this.collection));
    return onSnapshot(q, (querySnapshot) => {
      const result: Array<T> = [];
      querySnapshot.forEach((doc) => {
        let item = doc.data();
        item.id = doc.id;
        result.push(item as T);
      });
      callBack(result);
    });
  }
}
