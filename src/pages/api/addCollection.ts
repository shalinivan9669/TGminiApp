// src/pages/api/addCollection.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/adminApp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { imageUrl, name, description } = req.body;

  if (!imageUrl || !name || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newCollection = {
      imageUrl,
      name,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('collections').add(newCollection);
    return res.status(201).json({ id: docRef.id, ...newCollection });
  } catch (error) {
    console.error('Ошибка добавления коллекции:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
