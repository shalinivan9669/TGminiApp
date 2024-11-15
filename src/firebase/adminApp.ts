// src/core/firebase/adminApp.ts
import admin from 'firebase-admin';

// Проверяем, инициализирован ли уже Firebase Admin
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  // Проверяем наличие всех необходимых переменных окружения
  if (!projectId || !clientEmail || !privateKey || !storageBucket) {
    throw new Error('Missing one or more Firebase Admin environment variables: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  }

  // Корректно форматируем приватный ключ
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

  // Инициализируем Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: formattedPrivateKey,
    }),
    storageBucket,
  });
}

// Инициализация Firestore, Auth и Storage
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
