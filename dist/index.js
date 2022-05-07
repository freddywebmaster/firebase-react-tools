"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//auth exports
const Authentication_1 = require("./auth/Authentication");
const Firestore_1 = require("./firestore/Firestore");
const useAuth_1 = require("./hooks/useAuth");
const useStorage_1 = require("./hooks/useStorage");
module.exports = {
    AuthService: Authentication_1.AuthService,
    FirestoreService: Firestore_1.FirestoreService,
    useAuth: useAuth_1.useAuth,
    useStorage: useStorage_1.useStorage,
};
