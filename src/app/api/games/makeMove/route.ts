// app/api/games/makeMove/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';
import { Game, Round } from '@/types';
import { determineRoundResult } from '@/utils/helpers'; // Убедитесь, что helpers.ts существует

interface MakeMoveRequest {
  gameId: string;
  userId: string;
  move: 'rock' | 'paper' | 'scissors';
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  let body: MakeMoveRequest;
  try {
    body = await request.json();
    console.log('Received makeMove body:', body); // Логирование полученных данных
  } catch (error) {
    console.error('Invalid JSON:', error);
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { gameId, userId, move } = body;

  if (
    !gameId ||
    typeof gameId !== 'string' ||
    !userId ||
    typeof userId !== 'string' ||
    !move ||
    !['rock', 'paper', 'scissors'].includes(move)
  ) {
    console.error('Missing or invalid required fields:', body);
    return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      console.error('Game not found:', gameId);
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const gameData = gameSnap.data() as Game;

    if (!gameData.player2) {
      console.error('Game does not have a second player yet:', gameId);
      return NextResponse.json({ message: 'Game does not have a second player yet' }, { status: 400 });
    }

    if (gameData.status !== 'active') {
      console.error('Game is not active:', gameId);
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
      console.error('Игрок не участвует в этой игре:', userId);
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

    return NextResponse.json({ message: 'Move recorded successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error making move:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [makeMove API] Request End ---');
  }
}
