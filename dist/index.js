"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationSDK = exports.firestoreSDK = exports.storageSDK = exports.appSDK = exports.initFirebaseTools = exports.useQuery = exports.useStorage = exports.useAuth = exports.FirestoreService = exports.AuthService = void 0;
var Authentication_1 = require("./auth/Authentication");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return Authentication_1.AuthService; } });
var Firestore_1 = require("./firestore/Firestore");
Object.defineProperty(exports, "FirestoreService", { enumerable: true, get: function () { return Firestore_1.FirestoreService; } });
var useAuth_1 = require("./hooks/useAuth");
Object.defineProperty(exports, "useAuth", { enumerable: true, get: function () { return useAuth_1.useAuth; } });
var useStorage_1 = require("./hooks/useStorage");
Object.defineProperty(exports, "useStorage", { enumerable: true, get: function () { return useStorage_1.useStorage; } });
var useQuery_1 = require("./hooks/useQuery");
Object.defineProperty(exports, "useQuery", { enumerable: true, get: function () { return useQuery_1.useQuery; } });
var init_1 = require("./lib/init");
Object.defineProperty(exports, "initFirebaseTools", { enumerable: true, get: function () { return init_1.initFirebaseTools; } });
exports.appSDK = __importStar(require("firebase/app"));
exports.storageSDK = __importStar(require("firebase/storage"));
exports.firestoreSDK = __importStar(require("firebase/firestore"));
exports.authenticationSDK = __importStar(require("firebase/auth"));
