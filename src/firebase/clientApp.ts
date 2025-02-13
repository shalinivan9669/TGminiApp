// src/core/firebase/clientApp.ts
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Импортируем getAuth

// Ваши Firebase-конфигурации из .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Инициализация Firebase только один раз
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Инициализация Analytics (только на клиенте)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Инициализация Firestore
const db = getFirestore(app);

// Инициализация Authentication
const auth = getAuth(app);

// Экспортируем необходимые объекты
export { app, analytics, db, auth };
