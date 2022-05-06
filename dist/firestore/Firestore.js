"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreService = void 0;
const firestore_1 = require("firebase/firestore");
class FirestoreService {
    constructor(collection, app) {
        this.db = (0, firestore_1.getFirestore)(app);
        this.collection = collection;
    }
    add(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(this.db, this.collection), data);
                    data._id = docRef.id;
                    return {
                        data,
                        message: `document created with id: ${docRef.id}`,
                        error: false,
                    };
                }
                else {
                    yield (0, firestore_1.setDoc)((0, firestore_1.doc)(this.db, this.collection, id), data, { merge: true });
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
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
                const docSnap = yield (0, firestore_1.getDoc)(docRef);
                if (docSnap.exists()) {
                    let result = docSnap.data();
                    result._id = docSnap.id;
                    return { message: "Doc Exist", data: result, error: false };
                }
                else {
                    return { error: true, message: "Doc not found" };
                }
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    find(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!queryOptions) {
                /** GET ALL */
                try {
                    const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(this.db, this.collection));
                    const result = [];
                    yield querySnapshot.forEach((doc) => {
                        let item = doc.data();
                        item._id = doc.id;
                        result.push(item);
                    });
                    return {
                        message: "query executed success",
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
                    const querySnapshot = yield (0, firestore_1.getDocs)(q);
                    const result = [];
                    yield querySnapshot.forEach((doc) => {
                        let item = doc.data();
                        item.id = doc.id;
                        result.push(item);
                    });
                    return {
                        message: "query executed success",
                        data: result,
                        error: false,
                    };
                }
                catch (e) {
                    return { error: true, message: e.message };
                }
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, firestore_1.deleteDoc)((0, firestore_1.doc)(this.db, this.collection, id));
                return { data: { id }, message: `doc deleted: ${id}`, error: false };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    update(id, newData, merge = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
                (0, firestore_1.setDoc)(docRef, newData, { merge });
                newData._id = id;
                return { data: newData, message: `Doc updated ${id}`, error: false };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    transaction(id, field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
                yield (0, firestore_1.updateDoc)(docRef, {
                    [field]: (0, firestore_1.increment)(value),
                });
                return { error: false, message: "transaction success" };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    addInArray(id, field, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
                yield (0, firestore_1.updateDoc)(docRef, {
                    [field]: (0, firestore_1.arrayUnion)(data),
                });
                return {
                    error: false,
                    message: "data added to array success",
                    data: { id: docRef.id },
                };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    deleteInArray(id, field, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
                yield (0, firestore_1.updateDoc)(docRef, {
                    [field]: (0, firestore_1.arrayRemove)(data),
                });
                return {
                    error: false,
                    message: "data removed of array success",
                    data: { id: docRef.id },
                };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    deleteField(id, field) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(this.db, this.collection, id);
                yield (0, firestore_1.updateDoc)(docRef, {
                    [field]: (0, firestore_1.deleteField)(),
                });
                return { error: false, message: "field deleted", data: { id } };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    findDocumentRt(col, id, callBack) {
        try {
            return (0, firestore_1.onSnapshot)((0, firestore_1.doc)(this.db, col, id), function (doc) {
                callBack(doc.data());
            });
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
    findDocumentsRt(queryOptions, callback) {
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(this.db, this.collection), queryOptions);
            return (0, firestore_1.onSnapshot)(q, (querySnapshot) => {
                const result = [];
                querySnapshot.forEach((doc) => {
                    let item = doc.data();
                    item.id = doc.id;
                    result.push(item);
                });
                callback(result);
            });
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
    findCollectionRt(callBack) {
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(this.db, this.collection));
            return (0, firestore_1.onSnapshot)(q, (querySnapshot) => {
                const result = [];
                querySnapshot.forEach((doc) => {
                    let item = doc.data();
                    item.id = doc.id;
                    result.push(item);
                });
                callBack(result);
            });
        }
        catch (e) {
            return { error: true, message: e.message };
        }
    }
}
exports.FirestoreService = FirestoreService;
