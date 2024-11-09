// app/api/notifications/notifyPlayer1/route.ts
import { NextResponse } from 'next/server';
// import TelegramBot from 'node-telegram-bot-api';

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

  if (!telegramId || typeof telegramId !== 'number' || !gameId || typeof gameId !== 'string' || !opponentUsername || typeof opponentUsername !== 'string') {
    console.log('Missing or invalid required fields');
    return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
  }

  try {
    // const message = `Ваш противник ${opponentUsername} присоединился к игре ${gameId}!`;
    // await bot.sendMessage(telegramId, message);
    console.log(`Notification to Player 1: Opponent ${opponentUsername} joined game ${gameId}.`);
    return NextResponse.json({ message: 'Notification sent to Player 1' }, { status: 200 });
  } catch (error) {
    console.error('Error sending notification to Player 1:', error);
    return NextResponse.json({ message: 'Failed to send notification', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [notifyPlayer1 API] Request End ---');
  }
}
