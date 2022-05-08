import { useState } from "react";
import { ref, getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
import { FirebaseApp } from "firebase/app";
import { FirestoreService } from "../firestore/Firestore";

export interface iResponseStorage {
  file?: {
    url: string;
    metadata?: {
      contentType: string | undefined;
      fullPath: string;
      size: number;
      name: string;
    };
  };
  error: boolean;
}

export interface IUseStotage {
  uploading: boolean;
  uploadFile(
    reference: string,
    file: File,
    saveInDb?: boolean
  ): Promise<iResponseStorage>;
  uploadFiles(
    reference: string,
    files: FileList,
    saveInDb?: boolean
  ): Promise<Array<iResponseStorage>>;
}

export const useStorage = (app: FirebaseApp): IUseStotage => {
  const storage = getStorage(app);

  const db = new FirestoreService("storage", app);

  const [uploading, setUploading] = useState<boolean>(false);

  const uploadFile = async (
    reference: string,
    file: File,
    saveInDb?: boolean
  ): Promise<iResponseStorage> => {
    if (uploading) return { error: true };
    try {
      setUploading(true);

      const storageRef = ref(storage, reference);
      const uploadTask = await uploadBytes(storageRef, file);
      console.log(uploadTask);

      const url = await getDownloadURL(uploadTask.ref);

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
        const save = await db.add(fileResult, fileResult.metadata.generation);
        if (save.error) {
          console.log(save.message);
        } else {
          console.log("user was saved in db");
          console.log(save);
        }
      }
      setUploading(false);
      return {
        file: fileResult,
        error: false,
      };
    } catch (error) {
      setUploading(false);
      console.log(error);
      return { error: true };
    }
  };

  const uploadFiles = async (
    reference: string,
    files: FileList,
    saveInDb?: boolean
  ): Promise<Array<iResponseStorage>> => {
    if (uploading) return [{ error: true }];
    try {
      setUploading(true);
      const resulArray: Array<iResponseStorage> = [];

      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const upload = await uploadFile(
          reference + `/${files[i].name}${i}`,
          files[i],
          saveInDb
        );
        resulArray.push(upload);
      }

      return resulArray;
    } catch (error) {
      setUploading(false);
      console.log(error);
      return [{ error: true }];
    }
  };

  return {
    uploading,
    uploadFile,
    uploadFiles,
  };
};
