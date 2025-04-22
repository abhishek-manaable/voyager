import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence,
  setPersistence,
  connectAuthEmulator
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth永続性の設定
setPersistence(auth, browserLocalPersistence);

// Googleプロバイダーの設定
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: 'manaable.com'
});

// 開発環境の場合はエミュレーターに接続
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// オフラインサポートを有効化
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // 複数タブが開いている場合は1つのタブでのみ永続化が可能
  } else if (err.code === 'unimplemented') {
    // 現在のブラウザは永続化をサポートしていない
  }
});