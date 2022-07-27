import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app';

export const initFirebaseTools = (credentials: FirebaseOptions, nameApp: string): FirebaseApp =>
  initializeApp(credentials, nameApp || '[DEFAULT]');
