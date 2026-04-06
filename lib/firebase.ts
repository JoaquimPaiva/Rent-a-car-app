import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import * as FirebaseAuth from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyDziuC_KtfBrZV1MDPJkqV5hQdE9VKeb88',
  authDomain: 'rent-3c304.firebaseapp.com',
  databaseURL: 'https://rent-3c304-default-rtdb.firebaseio.com',
  projectId: 'rent-3c304',
  storageBucket: 'rent-3c304.firebasestorage.app',
  messagingSenderId: '333350818338',
  appId: '1:333350818338:web:2c55ae54788f28a2e0b07b',
  measurementId: 'G-V0NBBY03P3',
};

export const firebaseApp = initializeApp(firebaseConfig);

const { getAuth, initializeAuth } = FirebaseAuth;
type Auth = FirebaseAuth.Auth;
const getReactNativePersistence = (FirebaseAuth as { getReactNativePersistence?: (storage: unknown) => unknown })
  .getReactNativePersistence;

let authInstance: Auth;

try {
  if (Platform.OS === 'web') {
    authInstance = getAuth(firebaseApp);
  } else if (getReactNativePersistence) {
    authInstance = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage) as FirebaseAuth.Persistence,
    });
  } else {
    authInstance = getAuth(firebaseApp);
  }
} catch {
  authInstance = getAuth(firebaseApp);
}

export const auth = authInstance;
export const realtimeDb = getDatabase(firebaseApp);
