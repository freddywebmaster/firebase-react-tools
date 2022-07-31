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
} from 'firebase/firestore';
import { IResponseFirestore, IFirebaseFunctions, IPopulated } from './Interfaces';

export class FirestoreService implements IFirebaseFunctions {
  private db: Firestore;
  private readonly collection: string;

  constructor(app: FirebaseApp, collection: string) {
    this.db = getFirestore(app);
    this.collection = collection;
  }

  public async add(data: DocumentData, id?: string): Promise<IResponseFirestore> {
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

  public async findById(id: string): Promise<IResponseFirestore> {
    try {
      const docRef = doc(this.db, this.collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let result = docSnap.data();
        result._id = docSnap.id;
        return { message: 'Doc Exist', data: result, error: false };
      } else {
        return { error: true, message: 'Doc not found' };
      }
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async find(queryOptions?: QueryConstraint, populated?: IPopulated[]): Promise<IResponseFirestore> {
    try {
      const q = queryOptions ? query(Col(this.db, this.collection), queryOptions) : Col(this.db, this.collection);
      const querySnapshot = await getDocs(q);
      const result: Array<{}> = [];
      const resultPupulated: Array<{}> = [];

      await querySnapshot.forEach((doc) => {
        let item = doc.data();
        item._id = doc.id;
        result.push(item);
      });

      if (populated && populated.length !== 0) {
        const newResult: any = [];
        populated.map(async (pupulation) => {
          const q = await getDocs(Col(this.db, pupulation.collection));
          await q.forEach((doc) => {
            let item = doc.data();
            item._id = doc.id;
            item._collection = pupulation.collection;
            newResult.push(item);
          });
        });

        result.map((doc: any) => {
          populated.map(
            (docPopulated) =>
              (doc[docPopulated.field] =
                newResult.find(
                  (nr: any) => nr._id === doc[docPopulated.field] && nr._collection === docPopulated.collection,
                ) || 'not found'),
          );
          resultPupulated.push(doc);
        });
      }

      return {
        message: 'query executed success',
        data: !populated ? result : resultPupulated,
        error: false,
      };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async delete(id: string): Promise<IResponseFirestore> {
    try {
      await deleteDoc(doc(this.db, this.collection, id));
      return { data: { id }, message: `doc deleted: ${id}`, error: false };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async update(id: string, newData: DocumentData, merge: boolean = true): Promise<IResponseFirestore> {
    try {
      const docRef = doc(this.db, this.collection, id);
      setDoc(docRef, newData, { merge });
      newData._id = id;
      return { data: newData, message: `Doc updated ${id}`, error: false };
    } catch (e) {
      return { error: true, message: (e as Error).message };
    }
  }

  public async transaction(id: string, field: string, value: number): Promise<IResponseFirestore> {
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

  public async addInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: arrayUnion(data),
      });

      return {
        error: false,
        message: 'data added to array success',
        data: { _id: docRef.id },
      };
    } catch (e) {
      return {
        error: true,
        message: (e as Error).message,
      } as IResponseFirestore;
    }
  }
  public async deleteInArray(id: string, field: string, data: DocumentData): Promise<IResponseFirestore> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: arrayRemove(data),
      });

      return {
        error: false,
        message: 'data removed of array success',
        data: { _id: docRef.id },
      };
    } catch (e) {
      return {
        error: true,
        message: (e as Error).message,
      } as IResponseFirestore;
    }
  }

  public async deleteField(id: string, field: string): Promise<IResponseFirestore> {
    try {
      const docRef = doc(this.db, this.collection, id);
      await updateDoc(docRef, {
        [field]: deleteField(),
      });
      return { error: false, message: 'field deleted', data: { id } };
    } catch (e) {
      return {
        error: true,
        message: (e as Error).message,
      } as IResponseFirestore;
    }
  }

  public findDocumentRt(id: string, callBack: Function): Unsubscribe | IResponseFirestore {
    try {
      return onSnapshot(doc(this.db, this.collection, id), function (doc) {
        callBack(doc.data());
      });
    } catch (e) {
      return {
        error: true,
        message: (e as Error).message,
      } as IResponseFirestore;
    }
  }

  public findDocumentsRt(queryOptions: QueryConstraint, callback: Function): Unsubscribe | IResponseFirestore {
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
      return {
        error: true,
        message: (e as Error).message,
      } as IResponseFirestore;
    }
  }

  public findCollectionRt(callBack: Function): Unsubscribe | IResponseFirestore {
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
      return {
        error: true,
        message: (e as Error).message,
      } as IResponseFirestore;
    }
  }
}
