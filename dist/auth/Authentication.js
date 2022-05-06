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
exports.Authentication = void 0;
const auth_1 = require("firebase/auth");
const firestore_1 = require("../firestore");
const googleProvider = new auth_1.GoogleAuthProvider();
const GithubProvider = new auth_1.GithubAuthProvider();
const FacebookProvider = new auth_1.FacebookAuthProvider();
const TwitterProvider = new auth_1.TwitterAuthProvider();
class Authentication {
    constructor(app) {
        this.auth = (0, auth_1.getAuth)(app);
        this.db = new firestore_1.FirestoreService("users", app);
    }
    createEmailAccount(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield (0, auth_1.createUserWithEmailAndPassword)(this.auth, email, password);
                if (name)
                    yield (0, auth_1.updateProfile)(this.auth.currentUser, {
                        displayName: name,
                    });
                return {
                    error: false,
                    message: "Account created succesfully",
                    user: newUser.user,
                };
            }
            catch (e) {
                return {
                    error: true,
                    message: e.message,
                    user: null,
                };
            }
        });
    }
    loginEmailAccount(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, auth_1.signInWithEmailAndPassword)(this.auth, email, password);
                return {
                    error: false,
                    message: "Login successfully",
                    user: res.user,
                };
            }
            catch (e) {
                return {
                    error: true,
                    message: e.message,
                    user: null,
                };
            }
        });
    }
    loginGoogle() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, auth_1.signInWithPopup)(this.auth, googleProvider);
                return {
                    error: false,
                    message: "Authentication successfully",
                    user: result.user,
                };
            }
            catch (e) {
                return {
                    error: true,
                    message: e.message,
                };
            }
        });
    }
    loginGithub() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, auth_1.signInWithPopup)(this.auth, GithubProvider);
                return {
                    error: false,
                    message: "Authentication successfully",
                    user: result.user,
                };
            }
            catch (e) {
                return {
                    error: true,
                    message: e.message,
                    user: null,
                };
            }
        });
    }
    loginFacebook() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, auth_1.signInWithPopup)(this.auth, FacebookProvider);
                return {
                    error: false,
                    message: "Authentication successfully",
                    user: res.user,
                };
            }
            catch (e) {
                return {
                    error: true,
                    message: e.message,
                    user: null,
                };
            }
        });
    }
    loginTwitter() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, auth_1.signInWithPopup)(this.auth, TwitterProvider);
                return {
                    error: false,
                    message: "Authentication successfully",
                    user: res.user,
                };
            }
            catch (e) {
                return {
                    error: true,
                    message: e.message,
                    user: null,
                };
            }
        });
    }
    updatePass(password, newPassword, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.auth.currentUser;
                yield this.reAuthUser(password, () => {
                    (0, auth_1.updatePassword)(user, newPassword)
                        .then(() => {
                        if (callback)
                            callback(user);
                    })
                        .catch((error) => {
                        console.log(error);
                    });
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    UpdateProfile(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, auth_1.updateProfile)(this.auth.currentUser, data)
                    .then(() => {
                    if (callback)
                        callback();
                })
                    .catch((error) => {
                    console.log(error);
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reAuthUser(password, callBack) {
        var _a;
        const user = this.auth.currentUser;
        const credential = auth_1.EmailAuthProvider.credential(((_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "null", password);
        return (0, auth_1.reauthenticateWithCredential)(user, credential)
            .then(() => {
            callBack(user);
        })
            .catch((error) => {
            console.log(error);
        });
    }
    sendVerification(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, auth_1.sendEmailVerification)(this.auth.currentUser).then(() => {
                    if (callback)
                        callback();
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendResetPassword(email, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, auth_1.sendPasswordResetEmail)(this.auth, email)
                    .then(() => {
                    callback();
                })
                    .catch((error) => {
                    console.log(error);
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteAccount(password, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.reAuthUser(password, () => __awaiter(this, void 0, void 0, function* () {
                    yield (0, auth_1.deleteUser)(this.auth.currentUser)
                        .then(() => {
                        callback();
                    })
                        .catch((error) => {
                        console.log(error);
                    });
                }));
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateEmail(password, newEmail, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.reAuthUser(password, () => __awaiter(this, void 0, void 0, function* () {
                    yield (0, auth_1.updateEmail)(this.auth.currentUser, newEmail)
                        .then(() => {
                        if (callback)
                            callback();
                    })
                        .catch((error) => {
                        console.log(error);
                    });
                }));
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    closeSession(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, auth_1.signOut)(this.auth)
                    .then(() => {
                    if (callback)
                        callback();
                })
                    .catch((error) => {
                    console.log(error);
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveInFirestore(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.db.update(user.uid, user, false);
                if (res.error)
                    return false;
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.Authentication = Authentication;
