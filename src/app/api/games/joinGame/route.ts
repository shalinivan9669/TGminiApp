// src/pages/api/games/joinGame/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';

interface JoinGameRequest {
  gameId: string;
  userId: string;
  telegramId: number;
  username: string;
}

const BASE_URL = process.env.BASE_URL;

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

  let { gameId, userId, telegramId, username } = body;

  // Мокирование данных при отсутствии или некорректности входящих данных
  if (!gameId || typeof gameId !== 'string') {
    console.log('Using mock gameId');
    gameId = 'mockGame123';
  }
  if (!userId || typeof userId !== 'string') {
    console.log('Using mock userId');
    userId = 'mockUser456';
  }
  if (!telegramId || typeof telegramId !== 'number') {
    console.log('Using mock telegramId');
    telegramId = 9876543210;
  }
  if (!username || typeof username !== 'string') {
    console.log('Using mock username');
    username = 'mockUser456';
  }

  console.log('Final Fields:');
  console.log('gameId:', gameId);
  console.log('userId:', userId);
  console.log('telegramId:', telegramId);
  console.log('username:', username);

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
      console.log('Game is not open for joining. Status:', gameData.status);
      return NextResponse.json({ message: 'Game is not open for joining' }, { status: 400 });
    }

    if (gameData.players.length >= 2) {
      console.log('Game already has two players');
      return NextResponse.json({ message: 'Game already has two players' }, { status: 400 });
    }

    // Добавляем второго игрока
    console.log('Adding player to the game');
    await gameRef.update({
      players: FieldValue.arrayUnion(userId),
      updatedAt: FieldValue.serverTimestamp(),
      player2: {
        userId,
        telegramId,
        username,
      },
      status: 'active', // Изменяем статус на 'active'
    });
    console.log('Player added successfully');

    // Отправляем уведомление Player 1 о присоединении Player 2
    if (gameData.player1 && gameData.player1.telegramId) {
      console.log('Notifying Player 1 about new player');
      if (!BASE_URL) {
        console.error('BASE_URL is not defined in environment variables');
      } else {
        const notifyPlayer1Response = await fetch(`${BASE_URL}/api/notifications/notifyPlayer1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegramId: gameData.player1.telegramId,
            gameId,
            opponentUsername: username,
          }),
        });

        if (!notifyPlayer1Response.ok) {
          const errorData = await notifyPlayer1Response.json();
          console.error('Error notifying Player 1:', errorData);
        } else {
          console.log('Notification sent to Player 1');
        }
      }
    } else {
      console.log('Player 1 data is missing, skipping notification');
    }

    // Отправляем уведомление Player 2 о начале игры
    console.log('Notifying Player 2 about game start');
    if (BASE_URL) {
      const notifyPlayer2Response = await fetch(`${BASE_URL}/api/notifications/notifyPlayer2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId,
          gameId,
        }),
      });

      if (!notifyPlayer2Response.ok) {
        const errorData = await notifyPlayer2Response.json();
        console.error('Error notifying Player 2:', errorData);
      } else {
        console.log('Notification sent to Player 2');
      }
    } else {
      console.error('BASE_URL is not defined in environment variables');
    }

    return NextResponse.json({ message: 'Joined game successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error joining game:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [joinGame API] Request End ---');
  }
}
 