// src/types/index.d.ts

export interface User {
  id: string;
  telegramId: number;
  username: string;
}

export interface Round {
  roundNumber: number;
  player1Move: 'rock' | 'paper' | 'scissors' | null;
  player2Move: 'rock' | 'paper' | 'scissors' | null;
  result: 'player1Win' | 'player2Win' | 'tie' | null;
}

export interface Game {
  id: string;
  name: string; // Добавьте, если у вас есть поле "name" для игры
  player1: User;
  player2: User | null;
  betAmount: number;
  status: 'open' | 'active' | 'completed';
  rounds: Round[];
  createdAt: any; // Используйте более конкретный тип, если возможно
  updatedAt: any; // Используйте более конкретный тип, если возможно
  finalResult?: 'player1Win' | 'player2Win' | 'tie';
}
