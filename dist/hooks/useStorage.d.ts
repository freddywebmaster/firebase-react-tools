import { FirebaseApp } from 'firebase/app';
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
export interface IUseStorage {
    uploading: boolean;
    uploadFile(reference: string, file: File, saveInDb?: boolean): Promise<iResponseStorage>;
    uploadFiles(reference: string, files: FileList, saveInDb?: boolean): Promise<Array<iResponseStorage>>;
    deleteImage: (imageUrl: string) => Promise<void>;
}
export declare const useStorage: (app: FirebaseApp) => IUseStorage;
