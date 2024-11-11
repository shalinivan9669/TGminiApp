// src/pages/api/games/completeGame/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';

interface CompleteGameRequest {
  gameId: string;
}

const BASE_URL = process.env.BASE_URL;

export async function POST(request: Request) {
  console.log('--- [completeGame API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: CompleteGameRequest;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { gameId } = body;

  if (!gameId || typeof gameId !== 'string') {
    console.log('Missing or invalid gameId');
    return NextResponse.json({ message: 'Missing gameId' }, { status: 400 });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      console.log('Game not found:', gameId);
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const gameData = gameSnap.data() as any;

    if (gameData.status !== 'active') {
      console.log('Game is not active');
      return NextResponse.json({ message: 'Game is not active' }, { status: 400 });
    }

    // Подсчёт результатов всех раундов
    let player1Wins = 0;
    let player2Wins = 0;
    let ties = 0;

    gameData.rounds.forEach((round: any) => {
      if (round.result === 'player1') player1Wins += 1;
      if (round.result === 'player2') player2Wins += 1;
      if (round.result === 'draw') ties += 1;
    });

    // Определение итогового победителя
    let finalResult = '';
    if (player1Wins > player2Wins) {
      finalResult = 'player1Win';
    } else if (player2Wins > player1Wins) {
      finalResult = 'player2Win';
    } else {
      finalResult = 'tie';
    }

    // Обновление статуса игры
    await gameRef.update({
      status: 'completed',
      finalResult,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log('Game completed with result:', finalResult);

    // Отправка уведомления о финальном результате
    if (!BASE_URL) {
      console.error('BASE_URL is not defined in environment variables');
    } else {
      const notifyFinalResultResponse = await fetch(`${BASE_URL}/api/notifications/notifyFinalResult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          finalResult,
        }),
      });

      if (!notifyFinalResultResponse.ok) {
        const errorData = await notifyFinalResultResponse.json();
        console.error('Error notifying final result:', errorData);
      } else {
        console.log('Final result notification sent');
      }
    }

    return NextResponse.json({ message: 'Game completed successfully', finalResult }, { status: 200 });
  } catch (error: any) {
    console.error('Error completing game:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [completeGame API] Request End ---');
  }
}

export default POST;
