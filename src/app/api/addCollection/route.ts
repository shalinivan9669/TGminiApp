// src/app/api/addCollection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/firebase/adminApp';

export async function POST(request: NextRequest) {
  console.log('--- [addCollection API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: { imageUrl: string; name: string; description: string };

  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { imageUrl, name, description } = body;

  if (!imageUrl || !name || !description) {
    console.log('Missing required fields');
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newCollection = {
      imageUrl,
      name,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('collections').add(newCollection);
    console.log('Collection added with ID:', docRef.id);

    // Получаем документ для получения фактического значения createdAt
    const addedDoc = await docRef.get();
    const addedData = addedDoc.data();

    if (!addedData) {
      throw new Error('No data found for the added collection');
    }

    // Преобразуем Timestamp в Date
    const createdAt = addedData.createdAt?.toDate() || new Date();

    return NextResponse.json(
      { id: docRef.id, ...addedData, createdAt },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding collection:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    console.log('--- [addCollection API] Request End ---');
  }
}
