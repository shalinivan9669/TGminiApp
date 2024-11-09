// src/utils/helpers.ts

/**
 * Определяет результат раунда на основе ходов двух игроков.
 *
 * @param player1Move - Ход первого игрока ('rock', 'paper', 'scissors')
 * @param player2Move - Ход второго игрока ('rock', 'paper', 'scissors')
 * @returns Результат раунда: 'player1Win', 'player2Win' или 'tie'
 */
export const determineRoundResult = (
    player1Move: 'rock' | 'paper' | 'scissors',
    player2Move: 'rock' | 'paper' | 'scissors'
  ): 'player1Win' | 'player2Win' | 'tie' => {
    if (player1Move === player2Move) {
      return 'tie';
    }
  
    if (
      (player1Move === 'rock' && player2Move === 'scissors') ||
      (player1Move === 'paper' && player2Move === 'rock') ||
      (player1Move === 'scissors' && player2Move === 'paper')
    ) {
      return 'player1Win';
    }
  
    return 'player2Win';
  };
  