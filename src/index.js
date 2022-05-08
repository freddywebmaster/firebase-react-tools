//auth exports
const { AuthService } = require('./auth/Authentication');

const { FirestoreService } = require('./firestore/Firestore');

const { useAuth } = require('./hooks/useAuth');
const { useStorage } = require('./hooks/useStorage');

module.exports = {
  AuthService,
  FirestoreService,
  useAuth,
  useStorage,
};
