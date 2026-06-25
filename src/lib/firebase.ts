import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// IMPORTANT : remplacez ces valeurs par votre propre configuration Firebase
// Pour l'obtenir : Firebase Console > Paramètres du projet > Applications web
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'VOTRE_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'VOTRE_PROJECT_ID.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://VOTRE_PROJECT_ID-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'VOTRE_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'VOTRE_PROJECT_ID.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:xxxxxxxxxxxxxxxx',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);

export function isFirebaseConfigured(): boolean {
  return firebaseConfig.apiKey !== 'VOTRE_API_KEY' && firebaseConfig.databaseURL !== 'https://VOTRE_PROJECT_ID-default-rtdb.firebaseio.com';
}

export async function uploadFileToStorage(file: File, path: string): Promise<string> {
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export { ref, get, set };
