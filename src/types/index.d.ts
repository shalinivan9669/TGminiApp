// src/types/index.ts
export interface Game {
  name: string;
  description: string;
  imageUrl: string;
  players: string[];
  betAmount: number;
  status: 'open' | 'active' | 'completed';
  rounds: Round[];
  player1: Player;
  player2?: Player;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  finalResult?: string;
}

export interface Player {
  userId: string;
  telegramId: number;
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