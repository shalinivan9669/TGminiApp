// src/app/api/games/makeMove/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';
import { Game, Round } from '@/types';
import { determineRoundResult } from '@/utils/helpers';

interface MakeMoveRequest {
  gameId: string;
  userId: string;
  move: 'rock' | 'paper' | 'scissors';
}

export async function POST(request: Request) {
  console.log('--- [makeMove API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: MakeMoveRequest;
  try {
    body = await request.json();
    console.log('Received makeMove body:', body);
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
    console.log('Game Data:', JSON.stringify(gameData, null, 2));

    if (!gameData.player2) {
      console.error('Game does not have a second player yet:', gameId);
      return NextResponse.json({ message: 'Game does not have a second player yet' }, { status: 400 });
    }

    if (gameData.status !== 'active') {
      console.error('Game is not active:', gameId);
      return NextResponse.json({ message: 'Game is not active' }, { status: 400 });
    }

    // Определение, чей сейчас ход
    const isPlayer1 = gameData.player1.userId === userId;
    const playerRole = isPlayer1 ? 'player1' : 'player2';

    if (gameData.currentPlayer !== playerRole) {
      console.error('Not the player\'s turn:', userId);
      return NextResponse.json({ message: 'Not your turn' }, { status: 403 });
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
      currentRound = newRound;
    } else {
      currentRound = gameData.rounds[currentRoundIndex];
    }

    if (!currentRound) {
      throw new Error('Не удалось определить текущий раунд.');
    }

    // Обновление хода игрока
    if (playerRole === 'player1') {
      currentRound.player1Move = move;
    } else {
      currentRound.player2Move = move;
    }

    // Обновление раунда в массиве
    const updatedRounds = [...gameData.rounds];
    if (currentRoundIndex === -1) {
      updatedRounds.push(currentRound);
    } else {
      updatedRounds[currentRoundIndex] = currentRound;
    }

    // Проверка, сделали ли оба игрока ход
    if (currentRound.player1Move && currentRound.player2Move) {
      // Определяем результат раунда
      const result = determineRoundResult(currentRound.player1Move, currentRound.player2Move);
      currentRound.result = result;
      updatedRounds[currentRoundIndex === -1 ? updatedRounds.length - 1 : currentRoundIndex] = currentRound;

      // Проверка условия завершения игры
      if (updatedRounds.length >= (gameData.totalRounds || 3) && currentRound.result) {
        // Подсчет побед
        const player1Wins = updatedRounds.filter(round => round.result === 'player1').length;
        const player2Wins = updatedRounds.filter(round => round.result === 'player2').length;

        let winner: 'player1' | 'player2' | 'draw' = 'draw';
        if (player1Wins > player2Wins) {
          winner = 'player1';
        } else if (player2Wins > player1Wins) {
          winner = 'player2';
        }

        // Обновление статуса игры и победителя
        await gameRef.update({
          rounds: updatedRounds,
          status: 'completed',
          winner,
          updatedAt: FieldValue.serverTimestamp(),
        });

        console.log(`Game ${gameId} completed. Winner: ${winner}`);
      } else {
        // Обновление currentPlayer
        const nextPlayer = gameData.currentPlayer === 'player1' ? 'player2' : 'player1';

        // Обновление данных игры
        await gameRef.update({
          rounds: updatedRounds,
          currentPlayer: nextPlayer,
          updatedAt: FieldValue.serverTimestamp(),
        });

        console.log(`Round ${currentRound.roundNumber} result: ${result}`);
      }
    } else {
      // Обновление currentPlayer
      const nextPlayer = gameData.currentPlayer === 'player1' ? 'player2' : 'player1';

      // Обновление данных игры
      await gameRef.update({
        rounds: updatedRounds,
        currentPlayer: nextPlayer,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`Round ${currentRound.roundNumber} updated with ${playerRole}Move.`);
    }

    return NextResponse.json({ message: 'Move recorded successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error making move:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [makeMove API] Request End ---');
  }
}
