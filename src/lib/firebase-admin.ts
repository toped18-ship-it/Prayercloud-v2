import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';
import path from 'path';
import firebaseConfig from '../../firebase-applet-config.json';

const databaseURL = (firebaseConfig as any).databaseURL || 'https://prayercloud-e341d-default-rtdb.firebaseio.com';
const projectId = firebaseConfig.projectId || 'prayercloud-e341d';

function getCredential() {
  // 1. Check if SERVICE_ACCOUNT_KEY_PATH is set
  const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    try {
      const fileContent = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      return cert(fileContent);
    } catch (e) {
      console.warn('Could not parse service account file from path:', serviceAccountPath, e);
    }
  }

  // 2. Check local fallback file serviceAccountKey.json if present
  const localKeyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  if (fs.existsSync(localKeyPath)) {
    try {
      const fileContent = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
      return cert(fileContent);
    } catch (e) {
      console.warn('Could not parse local serviceAccountKey.json:', e);
    }
  }

  // 3. Check inline JSON in environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      return cert(parsed);
    } catch (e) {
      console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT env var JSON:', e);
    }
  }

  // 4. Default to Application Default Credentials
  try {
    return applicationDefault();
  } catch (e) {
    return undefined;
  }
}

if (!getApps().length) {
  const credential = getCredential();
  initializeApp({
    ...(credential ? { credential } : {}),
    projectId,
    databaseURL,
  });
}

export const adminAuth = getAuth();
export const adminFirestore = getFirestore();
export const adminRtdb = getDatabase();

export default {
  adminAuth,
  adminFirestore,
  adminRtdb,
};
