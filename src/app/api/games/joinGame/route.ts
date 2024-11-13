// src/app/api/games/joinGame/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';

interface JoinGameRequest {
  gameId: string;
  userId: string;
  telegramId: string;
  username: string;
  betAmount: number;
}

export async function POST(request: Request) {
  console.log('--- [joinGame API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: JoinGameRequest;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  let { gameId, userId, telegramId, username, betAmount } = body;

  if (!gameId || typeof gameId !== 'string') {
    console.log('Invalid or missing gameId');
    return NextResponse.json({ message: 'Invalid or missing gameId' }, { status: 400 });
  }
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
  if (!betAmount || typeof betAmount !== 'number' || betAmount <= 0) {
    console.log('Invalid or missing betAmount');
    return NextResponse.json({ message: 'Invalid or missing betAmount' }, { status: 400 });
  }

  console.log('Final Fields:');
  console.log('gameId:', gameId);
  console.log('userId:', userId);
  console.log('telegramId:', telegramId);
  console.log('username:', username);
  console.log('betAmount:', betAmount);

  try {
    const gameRef = db.collection('games').doc(gameId);
    console.log('Fetching game with ID:', gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      console.log('Game not found:', gameId);
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const gameData = gameSnap.data() as any;
    console.log('Game Data:', JSON.stringify(gameData, null, 2));

    if (gameData?.status !== 'open') {
      console.log('Game is not available for joining. Status:', gameData.status);
      return NextResponse.json({ message: 'Game is not available for joining' }, { status: 400 });
    }

    if (gameData.players.length >= 2) {
      console.log('Game already has two players');
      return NextResponse.json({ message: 'Game already has two players' }, { status: 400 });
    }

    // Проверяем, не пытается ли пользователь присоединиться к своей игре
    if (gameData.creatorId === userId) {
      console.log('User cannot join their own game');
      return NextResponse.json({ message: 'You cannot join your own game' }, { status: 400 });
    }

    // Добавляем второго игрока и обновляем ставку
    console.log('Adding player to the game');
    await gameRef.update({
      players: FieldValue.arrayUnion(userId),
      updatedAt: FieldValue.serverTimestamp(),
      player2: {
        userId,
        telegramId,
        username,
      },
      pendingBetAmount: betAmount,
      status: 'pending', // Изменяем статус на 'pending' после присоединения второго игрока
    });
    console.log('Player added successfully');

    // Отправляем уведомление Player 1 о предложенной ставке (опционально)
    // Ваш код для отправки уведомления

    return NextResponse.json({ message: 'Joined game successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error joining game:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [joinGame API] Request End ---');
  }
}
