// src/app/api/games/acceptBet/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';
import { Game } from '@/types';

interface AcceptBetRequest {
  gameId: string;
}

export async function POST(request: Request) {
  console.log('--- [acceptBet API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: AcceptBetRequest;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { gameId } = body;

  if (!gameId || typeof gameId !== 'string') {
    console.log('Invalid or missing gameId');
    return NextResponse.json({ message: 'Invalid or missing gameId' }, { status: 400 });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      console.log('Game not found:', gameId);
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const gameData = gameSnap.data() as Game;
    console.log('Game Data:', JSON.stringify(gameData, null, 2));

    if (gameData.status !== 'pending') {
      console.log('Game is not pending');
      return NextResponse.json({ message: 'Game is not pending' }, { status: 400 });
    }

    if (!gameData.player2) {
      console.log('Game does not have a second player');
      return NextResponse.json({ message: 'Game does not have a second player' }, { status: 400 });
    }

    // Обновление ставки и статуса игры на 'active'
    await gameRef.update({
      betAmount: gameData.pendingBetAmount,
      isBetAccepted: true,
      status: 'active',
      updatedAt: FieldValue.serverTimestamp(),
      pendingBetAmount: FieldValue.delete(),
    });

    console.log('Bet accepted. Game is now active.');

    // Опционально: отправка уведомлений игрокам

    return NextResponse.json({ message: 'Bet accepted. Game is now active.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error accepting bet:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [acceptBet API] Request End ---');
  }
}
