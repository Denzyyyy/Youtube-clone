import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

initializeApp()

const firestore = new Firestore();


export const createUser = functions.identity.beforeUserCreated(
    {region: "us-west1"}, (UserRecord) => {
        const userInfo = {
            uid : UserRecord.data?.uid,
            email: UserRecord.data?.email,
            photoUrl : UserRecord.data?.photoURL
    };

    firestore.collection("users").doc(UserRecord).set(userInfo);
    logger.info(`User Created: ${JSON.stringify(userInfo)}`);
    return;
 });
