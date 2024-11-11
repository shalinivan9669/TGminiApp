// src/app/api/notifications/notifyPlayer1/route.ts
import { NextResponse } from 'next/server';
// import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/firebase/adminApp';

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

interface NotifyPlayer1Request {
  telegramId: number;
  gameId: string;
  opponentUsername: string;
}

export async function POST(request: Request) {
  console.log('--- [notifyPlayer1 API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: NotifyPlayer1Request;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { telegramId, gameId, opponentUsername } = body;

  if (!telegramId || !gameId || !opponentUsername) {
    console.log('Missing required fields');
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    // const message = `Игрок ${opponentUsername} присоединился к вашей игре ${gameId}.`;
    // await bot.sendMessage(telegramId, message);
    console.log(`Player 1 notified: Игрок ${opponentUsername} присоединился к вашей игре ${gameId}.`);

    return NextResponse.json({ message: 'Player 1 notified successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error notifying Player 1:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [notifyPlayer1 API] Request End ---');
  }
}
