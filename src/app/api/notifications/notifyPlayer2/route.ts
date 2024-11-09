// app/api/notifications/notifyPlayer2/route.ts
import { NextResponse } from 'next/server';
// import TelegramBot from 'node-telegram-bot-api';

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

  if (!telegramId || typeof telegramId !== 'number' || !gameId || typeof gameId !== 'string') {
    console.log('Missing or invalid required fields');
    return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
  }

  try {
    // const message = `Вы присоединились к игре ${gameId}! Начните раунды!`;
    // await bot.sendMessage(telegramId, message);
    console.log(`Notification to Player 2: Joined game ${gameId}. Start rounds.`);
    return NextResponse.json({ message: 'Notification sent to Player 2' }, { status: 200 });
  } catch (error) {
    console.error('Error sending notification to Player 2:', error);
    return NextResponse.json({ message: 'Failed to send notification', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [notifyPlayer2 API] Request End ---');
  }
}
