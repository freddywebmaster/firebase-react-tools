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
exports.useStorage = void 0;
const react_1 = require("react");
const storage_1 = require("firebase/storage");
const firestore_1 = require("../firestore");
const useStorage = (app) => {
    const storage = (0, storage_1.getStorage)(app);
    const db = new firestore_1.FirestoreService("storage", app);
    const [uploading, setUploading] = (0, react_1.useState)(false);
    const uploadFile = (reference, file, saveInDb) => __awaiter(void 0, void 0, void 0, function* () {
        if (uploading)
            return { error: true };
        try {
            setUploading(true);
            const storageRef = (0, storage_1.ref)(storage, reference);
            const uploadTask = yield (0, storage_1.uploadBytes)(storageRef, file);
            console.log(uploadTask);
            const url = yield (0, storage_1.getDownloadURL)(uploadTask.ref);
            const fileResult = {
                url,
                metadata: {
                    contentType: uploadTask.metadata.contentType,
                    fullPath: uploadTask.metadata.fullPath,
                    size: uploadTask.metadata.size,
                    name: uploadTask.metadata.name,
                    generation: uploadTask.metadata.generation,
                },
            };
            if (url && saveInDb) {
                const save = yield db.add(fileResult, fileResult.metadata.generation);
                if (save.error) {
                    console.log(save.message);
                }
                else {
                    console.log("user was saved in db");
                    console.log(save);
                }
            }
            setUploading(false);
            return {
                file: fileResult,
                error: false,
            };
        }
        catch (error) {
            setUploading(false);
            console.log(error);
            return { error: true };
        }
    });
    const uploadFiles = (reference, files, saveInDb) => __awaiter(void 0, void 0, void 0, function* () {
        if (uploading)
            return [{ error: true }];
        try {
            setUploading(true);
            const resulArray = [];
            const totalFiles = files.length;
            for (let i = 0; i < totalFiles; i++) {
                const upload = yield uploadFile(reference + `/${files[i].name}${i}`, files[i], saveInDb);
                resulArray.push(upload);
            }
            return resulArray;
        }
        catch (error) {
            setUploading(false);
            console.log(error);
            return [{ error: true }];
        }
    });
    return {
        uploading,
        uploadFile,
        uploadFiles,
    };
};
exports.useStorage = useStorage;
