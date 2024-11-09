// app/api/games/createRound/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';
import { Game, Round } from '@/types';
import { determineRoundResult } from '@/utils/helpers'; // Убедитесь, что helpers.ts существует

interface CreateRoundRequest {
  gameId: string;
  userId: string;
  move: 'rock' | 'paper' | 'scissors';
}

export async function POST(request: Request) {
  console.log('--- [createRound API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: CreateRoundRequest;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { gameId, userId, move } = body;

  console.log('Received Fields:');
  console.log('gameId:', gameId);
  console.log('userId:', userId);
  console.log('move:', move);

  if (!gameId || typeof gameId !== 'string') {
    console.log('Invalid or missing gameId');
    return NextResponse.json({ message: 'Invalid or missing gameId' }, { status: 400 });
  }
  if (!userId || typeof userId !== 'string') {
    console.log('Invalid or missing userId');
    return NextResponse.json({ message: 'Invalid or missing userId' }, { status: 400 });
  }
  if (!move || !['rock', 'paper', 'scissors'].includes(move)) {
    console.log('Invalid or missing move');
    return NextResponse.json({ message: 'Invalid or missing move' }, { status: 400 });
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

    if (gameData.status !== 'active') {
      console.log('Game is not active');
      return NextResponse.json({ message: 'Game is not active' }, { status: 400 });
    }

    // Определение текущего раунда
    const currentRoundIndex = gameData.rounds.findIndex(round => !round.result);
    let currentRound: Round | null = null;

    if (currentRoundIndex === -1) {
      // Все раунды завершены, создать новый раунд
      const newRound: Round = {
        roundNumber: gameData.rounds.length + 1,
        player1Move: null,
        player2Move: null,
        result: null,
      };
      await gameRef.update({
        rounds: FieldValue.arrayUnion(newRound),
        updatedAt: FieldValue.serverTimestamp(),
      });
      currentRound = newRound;
      console.log('New round created:', newRound);
    } else {
      currentRound = gameData.rounds[currentRoundIndex];
    }

    if (!currentRound) {
      throw new Error('Не удалось определить текущий раунд.');
    }

    // Определение, чей ход
    const isPlayer1 = gameData.player1.id === userId;
    if (isPlayer1) {
      currentRound.player1Move = move;
    } else if (gameData.player2 && gameData.player2.id === userId) {
      currentRound.player2Move = move;
    } else {
      return NextResponse.json({ message: 'Игрок не участвует в этой игре.' }, { status: 403 });
    }

    // Обновление раунда в массиве
    const updatedRounds = [...gameData.rounds];
    updatedRounds[currentRoundIndex === -1 ? updatedRounds.length - 1 : currentRoundIndex] = currentRound;

    // Проверка, сделали ли оба игрока ход
    if (currentRound.player1Move && currentRound.player2Move) {
      // Определяем результат раунда с использованием функции из helpers
      const result = determineRoundResult(currentRound.player1Move, currentRound.player2Move);
      currentRound.result = result;
      updatedRounds[currentRoundIndex === -1 ? updatedRounds.length - 1 : currentRoundIndex] = currentRound;

      // Обновление раундов в Firestore
      await gameRef.update({
        rounds: updatedRounds,
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Round ${currentRound.roundNumber} result: ${result}`);
    } else {
      // Обновление только текущего раунда
      await gameRef.update({
        rounds: updatedRounds,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`Round ${currentRound.roundNumber} updated with ${isPlayer1 ? 'player1Move' : 'player2Move'}.`);
    }

    return NextResponse.json({ message: 'Round processed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing round:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [createRound API] Request End ---');
  }
}
