import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {auth} from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = new Firestore();


export const createUser = auth.user().onCreate(async (user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

