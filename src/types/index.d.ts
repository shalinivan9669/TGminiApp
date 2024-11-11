// src/types/index.ts
import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Game {
  name: string;
  description: string;
  imageUrl: string;
  players: string[];
  betAmount: number;
  status: 'open' | 'active' | 'completed';
  rounds: Round[];
  player1: PlayerWithStringTelegramId;
  player2?: PlayerWithStringTelegramId;
  createdAt: Timestamp;
  updatedAt: Timestamp | FieldValue; // Обновлено
  finalResult?: string;
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
  // Добавьте другие свойства, если необходимо
}




export interface GameWithId extends Game {
  id: string;
  player1: PlayerWithStringTelegramId;
  player2?: PlayerWithStringTelegramId;
}

export interface PlayerWithStringTelegramId extends Player {
  telegramId: string; // Строго string после преобразования
}