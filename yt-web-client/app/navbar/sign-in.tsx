'use client';

import { Fragment } from "react";

import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from './sign-in.module.css';
import { User } from "firebase/auth";

interface signInProps{
    user: User | null;
}

export default function SignIn({user}: signInProps) {


    return (
        <div>
      {user ? (
        // If user is signed in, show a welcome message (or something else)
        <button className={styles.signin} onClick={signOut}>
          Sign Out
        </button>
      ) : (
        // If user is not signed in, show sign-in button
        <button className={styles.signin} onClick={signInWithGoogle}>
          Sign in
        </button>
      )}
    </div>
  );
}