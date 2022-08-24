"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreService = void 0;
const firestore_1 = require("firebase/firestore");
class FirestoreService {
    constructor(app, collection) {
        this.db = (0, firestore_1.getFirestore)(app);
        this.collection = collection;
    }
    async add(data, id) {
        try {
            if (!id) {
                const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(this.db, this.collection), data);
                data._id = docRef.id;
                return {
                    data,
                    message: `document created with id: ${docRef.id}`,
                    error: false,
                };
            }
            else {
                await (0, firestore_1.setDoc)((0, firestore_1.doc)(this.db, this.collection, id), data, { merge: true });
                data._id = id;
                return {
                    data,
                    message: `document created with id: ${id}`,
                    error: false,
                };
            }
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
    async findById(id) {
        try {
            const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
            const docSnap = await (0, firestore_1.getDoc)(docRef);
            if (docSnap.exists()) {
                let result = docSnap.data();
                result._id = docSnap.id;
                return { message: 'Doc Exist', data: result, error: false };
            }
            else {
                return { error: true, message: 'Doc not found' };
            }
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
    async find(queryOptions) {
        if (!queryOptions) {
            /** GET ALL */
            try {
                const querySnapshot = await (0, firestore_1.getDocs)((0, firestore_1.collection)(this.db, this.collection));
                const result = [];
                await querySnapshot.forEach((doc) => {
                    let item = doc.data();
                    item._id = doc.id;
                    result.push(item);
                });
                return {
                    message: 'query executed success',
                    data: result,
                    error: false,
                };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        }
        else {
            try {
                const q = (0, firestore_1.query)((0, firestore_1.collection)(this.db, this.collection), queryOptions);
                const querySnapshot = await (0, firestore_1.getDocs)(q);
                const result = [];
                await querySnapshot.forEach((doc) => {
                    const item = doc.data();
                    item._id = doc.id;
                    result.push(item);
                });
                return {
                    message: 'query executed success',
                    data: result,
                    error: false,
                };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        }
    }
    async delete(id) {
        try {
            await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(this.db, this.collection, id));
            return { data: { id }, message: `doc deleted: ${id}`, error: false };
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
    async update(id, newData, merge = true) {
        try {
            const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
            (0, firestore_1.setDoc)(docRef, newData, { merge });
            newData._id = id;
            return { data: newData, message: `Doc updated ${id}`, error: false };
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
    async transaction(id, field, value) {
        try {
            const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
            await (0, firestore_1.updateDoc)(docRef, {
                [field]: (0, firestore_1.increment)(value),
            });
            return { error: false, message: 'transaction success' };
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
    async addInArray(id, field, data) {
        try {
            const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
            await (0, firestore_1.updateDoc)(docRef, {
                [field]: (0, firestore_1.arrayUnion)(data),
            });
            return {
                error: false,
                message: 'data added to array success',
                data: { _id: docRef.id },
            };
        }
        catch (e) {
            return {
                error: true,
                message: e.message,
            };
        }
    }
    async deleteInArray(id, field, data) {
        try {
            const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
            await (0, firestore_1.updateDoc)(docRef, {
                [field]: (0, firestore_1.arrayRemove)(data),
            });
            return {
                error: false,
                message: 'data removed of array success',
                data: { _id: docRef.id },
            };
        }
        catch (e) {
            return {
                error: true,
                message: e.message,
            };
        }
    }
    async deleteField(id, field) {
        try {
            const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
            await (0, firestore_1.updateDoc)(docRef, {
                [field]: (0, firestore_1.deleteField)(),
            });
            return { error: false, message: 'field deleted', data: { id } };
        }
        catch (e) {
            return {
                error: true,
                message: e.message,
            };
        }
    }
    documentSuscribe(id, callBack) {
        return (0, firestore_1.onSnapshot)((0, firestore_1.doc)(this.db, this.collection, id), function (doc) {
            callBack(doc);
        });
    }
    collectionSuscribe(callBack, queryOptions) {
        const q = queryOptions ? (0, firestore_1.query)((0, firestore_1.collection)(this.db, this.collection), queryOptions) : (0, firestore_1.query)((0, firestore_1.collection)(this.db, this.collection));
        return (0, firestore_1.onSnapshot)(q, (querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
                let item = doc.data();
                item._id = doc.id;
                result.push(item);
            });
            callBack(result);
        });
    }
}
exports.FirestoreService = FirestoreService;
