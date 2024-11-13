// src/types/index.ts
import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Game {
  name: string;
  description: string;
  imageUrl: string;
  players: string[];
  betAmount: number;
  status: 'pending' | 'open' | 'active' | 'completed';
  rounds: Round[];
  player1: PlayerWithStringTelegramId;
  player2?: PlayerWithStringTelegramId;
  createdAt: Timestamp;
  updatedAt: Timestamp | FieldValue;
  finalResult?: string;
  creatorId: string;
  currentPlayer: 'player1' | 'player2';
  pendingBetAmount?: number; // Ставка второго игрока, ожидающая подтверждения
  isBetAccepted?: boolean;   // Флаг принятия ставки первым игроком
  totalRounds?: number;      // Общее количество раундов (например, 3)
  winner?: 'player1' | 'player2' | 'draw' | null; // Победитель игры
}

export interface Player {
  userId: string;
  telegramId: string | number;
  username: string;
}

export interface Round {
  roundNumber: number;
  player1Move: 'rock' | 'paper' | 'scissors' | null;
  player2Move: 'rock' | 'paper' | 'scissors' | null;
  result: 'player1' | 'player2' | 'draw' | null;
}

export interface Collection {
  imageUrl: string;
  name: string;
  description: string;
}

export interface Character {
  imageUrl: string;
  name: string;
  description: string;
}

export interface GameWithId extends Game {
  id: string;
  player1: PlayerWithStringTelegramId;
  player2?: PlayerWithStringTelegramId;
}

export interface PlayerWithStringTelegramId extends Player {
  telegramId: string; // Строго string после преобразования
}
