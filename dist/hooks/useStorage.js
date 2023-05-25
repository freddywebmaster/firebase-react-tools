"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStorage = void 0;
const react_1 = require("react");
const storage_1 = require("firebase/storage");
const Firestore_1 = require("../services/firestore/Firestore");
const useStorage = (app) => {
    const storage = (0, storage_1.getStorage)(app);
    const Db = new Firestore_1.FirestoreService(app, 'storage');
    const [uploading, setUploading] = (0, react_1.useState)(false);
    const uploadFile = async (reference, file, saveInDb) => {
        if (uploading)
            return { error: true };
        try {
            setUploading(true);
            const storageRef = (0, storage_1.ref)(storage, reference);
            const uploadTask = await (0, storage_1.uploadBytes)(storageRef, file);
            console.log(uploadTask);
            const url = await (0, storage_1.getDownloadURL)(uploadTask.ref);
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
                const save = await Db.add(fileResult, fileResult.metadata.generation);
                if (save.error) {
                    console.log(save.message);
                }
                else {
                    console.log('user was saved in db');
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
    };
    const uploadFiles = async (reference, files, saveInDb) => {
        if (uploading)
            return [{ error: true }];
        try {
            setUploading(true);
            const resulArray = [];
            const totalFiles = files.length;
            for (let i = 0; i < totalFiles; i++) {
                const upload = await uploadFile(reference + `/${files[i].name}${i}`, files[i], saveInDb);
                resulArray.push(upload);
            }
            return resulArray;
        }
        catch (error) {
            setUploading(false);
            console.log(error);
            return [{ error: true }];
        }
    };
    const deleteImage = async (imageUrl) => {
        const storage = (0, storage_1.getStorage)(app);
        const reference = (0, storage_1.ref)(storage, imageUrl);
        return await (0, storage_1.deleteObject)(reference);
    };
    return {
        uploading,
        uploadFile,
        uploadFiles,
        deleteImage,
    };
};
exports.useStorage = useStorage;
