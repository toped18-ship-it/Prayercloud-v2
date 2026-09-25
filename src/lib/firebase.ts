import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

const rtdbUrl = (firebaseConfig as any).databaseURL || 'https://prayercloud-e341d-default-rtdb.firebaseio.com';

const app = !getApps().length
  ? initializeApp({
      ...firebaseConfig,
      databaseURL: rtdbUrl
    })
  : getApp();

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const rtdb = getDatabase(app, rtdbUrl);
export const db = getFirestore(app);

export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
