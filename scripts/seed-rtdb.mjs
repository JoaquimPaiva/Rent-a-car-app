import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDziuC_KtfBrZV1MDPJkqV5hQdE9VKeb88',
  authDomain: 'rent-3c304.firebaseapp.com',
  databaseURL: 'https://rent-3c304-default-rtdb.firebaseio.com',
  projectId: 'rent-3c304',
  storageBucket: 'rent-3c304.firebasestorage.app',
  messagingSenderId: '333350818338',
  appId: '1:333350818338:web:2c55ae54788f28a2e0b07b',
  measurementId: 'G-V0NBBY03P3'
};

const email = process.env.OPTCAR_ADMIN_EMAIL;
const password = process.env.OPTCAR_ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Missing env vars: OPTCAR_ADMIN_EMAIL and OPTCAR_ADMIN_PASSWORD');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const raw = await readFile(new URL('../database.seed.json', import.meta.url), 'utf8');
const payload = JSON.parse(raw);

await signInWithEmailAndPassword(auth, email, password);
await set(ref(db, '/'), payload);

console.log('Realtime Database seeded successfully.');
