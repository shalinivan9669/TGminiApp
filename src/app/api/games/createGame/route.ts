// src/app/api/games/createGame/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';

interface CreateGameRequest {
  userId: string;
  telegramId: string;
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

  if (!userId || typeof userId !== 'string') {
    console.log('Invalid or missing userId');
    return NextResponse.json({ message: 'Invalid or missing userId' }, { status: 400 });
  }
  if (!telegramId || typeof telegramId !== 'string') {
    console.log('Invalid or missing telegramId');
    return NextResponse.json({ message: 'Invalid or missing telegramId' }, { status: 400 });
  }
  if (!username || typeof username !== 'string') {
    console.log('Invalid or missing username');
    return NextResponse.json({ message: 'Invalid or missing username' }, { status: 400 });
  }
  if (!betAmount || typeof betAmount !== 'number') {
    console.log('Invalid or missing betAmount');
    return NextResponse.json({ message: 'Invalid or missing betAmount' }, { status: 400 });
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
      players: [userId], // Добавляем идентификатор создателя в список игроков
      betAmount,
      status: 'open',
      rounds: [],
      player1: {
        userId,
        telegramId,
        username,
      },
      creatorId: userId,
      currentPlayer: 'player1',
      totalRounds: 3,
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
