// src/pages/api/games/createGame.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';

interface CreateGameRequest {
  userId: string;
  telegramId: string;
  username: string;
  betAmount: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, telegramId, username, betAmount } = req.body as CreateGameRequest;

  if (!userId || !telegramId || !username || !betAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newGame = {
      player1: {
        userId,
        telegramId,
        username,
      },
      player2: null,
      betAmount,
      status: 'open', // open, active, completed
      rounds: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const gameRef = await db.collection('games').add(newGame);
    return res.status(201).json({ id: gameRef.id, ...newGame });
  } catch (error) {
    console.error('Error creating game:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
