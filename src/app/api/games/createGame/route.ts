// app/api/games/createGame/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';

interface CreateGameRequest {
  userId: string;
  telegramId: number;
  username: string;
  betAmount: number;
}

export async function POST(request: Request) {
  console.log('--- [createGame API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: CreateGameRequest;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  let { userId, telegramId, username, betAmount } = body;

  // Мокирование данных при отсутствии или некорректности входящих данных
  if (!userId || typeof userId !== 'string') {
    console.log('Using mock userId');
    userId = 'mockUser123';
  }
  if (!telegramId || typeof telegramId !== 'number') {
    console.log('Using mock telegramId');
    telegramId = 1234567890;
  }
  if (!username || typeof username !== 'string') {
    console.log('Using mock username');
    username = 'mockUser';
  }
  if (!betAmount || typeof betAmount !== 'number') {
    console.log('Using mock betAmount');
    betAmount = 10;
  }

  console.log('Final Fields:');
  console.log('userId:', userId);
  console.log('telegramId:', telegramId);
  console.log('username:', username);
  console.log('betAmount:', betAmount);

  try {
    const newGameRef = db.collection('games').doc();
    console.log('Creating new game with ID:', newGameRef.id);

    const gameData = {
      name: `Игра от ${username}`,
      description: `Ставка: ${betAmount} ETH`,
      imageUrl: '/images/game_placeholder.jpg',
      players: [userId],
      betAmount,
      status: 'open',
      rounds: [],
      player1: {
        userId,
        telegramId,
        username,
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    console.log('Game Data to be saved:', JSON.stringify(gameData, null, 2));

    await newGameRef.set(gameData);
    console.log('Game successfully created with ID:', newGameRef.id);

    return NextResponse.json({ message: 'Game created successfully', gameId: newGameRef.id }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [createGame API] Request End ---');
  }
}
