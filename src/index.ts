//auth exports
import { AuthService } from "./auth/Authentication";

import { FirestoreService } from "./firestore/Firestore";

import { useAuth } from "./hooks/useAuth";
import { useStorage } from "./hooks/useStorage";

module.exports = {
  AuthService,
  FirestoreService,
  useAuth,
  useStorage,
};
