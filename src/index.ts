export { AuthService } from './auth/Authentication';

export { FirestoreService } from './firestore/Firestore';

export { useAuth } from './hooks/useAuth';
export { useStorage } from './hooks/useStorage';
export { useQuery } from './hooks/useQuery';

export { initFirebaseTools } from './lib/init';

export * as appSDK from 'firebase/app';
export * as storageSDK from 'firebase/storage';
export * as firestoreSDK from 'firebase/firestore';
export * as authenticationSDK from 'firebase/auth';
