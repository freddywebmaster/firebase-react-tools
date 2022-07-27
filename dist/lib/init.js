"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFirebaseTools = void 0;
const app_1 = require("firebase/app");
const initFirebaseTools = (credentials, nameApp) => (0, app_1.initializeApp)(credentials, nameApp || '[DEFAULT]');
exports.initFirebaseTools = initFirebaseTools;
