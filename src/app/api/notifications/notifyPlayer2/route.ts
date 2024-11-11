// src/app/api/notifications/notifyPlayer2/route.ts
import { NextResponse } from 'next/server';
// import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/firebase/adminApp';

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

interface NotifyPlayer2Request {
  telegramId: number;
  gameId: string;
}

export async function POST(request: Request) {
  console.log('--- [notifyPlayer2 API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: NotifyPlayer2Request;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { telegramId, gameId } = body;

  if (!telegramId || !gameId) {
    console.log('Missing required fields');
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    // const message = `Вы присоединились к игре ${gameId}. Начните игру!`;
    // await bot.sendMessage(telegramId, message);
    console.log(`Player 2 notified: Вы присоединились к игре ${gameId}. Начните игру!`);

    return NextResponse.json({ message: 'Player 2 notified successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error notifying Player 2:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [notifyPlayer2 API] Request End ---');
  }
}
