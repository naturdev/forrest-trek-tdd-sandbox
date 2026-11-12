import { TicTacToe } from './tictactoe.js';

/**
 * Create a TicTacToe game and execute a sequence of moves
 * @param {number[]} moves - Array of positions (0-8) to play in order
 * @returns {TicTacToe} - Configured game instance
 */
export function createGameFromMoves(moves) {
  const game = new TicTacToe();
  for (const position of moves) {
    game.makeMove(position);
  }
  return game;
}

/**
 * Create a TicTacToe game with a specific board state
 * @param {(string|null)[]} boardArray - Array of 9 cells ('X', 'O', or null)
 * @param {string} currentPlayer - 'X' or 'O'
 * @returns {TicTacToe} - Configured game instance
 */
export function createGameFromBoard(boardArray, currentPlayer = 'X') {
  const game = new TicTacToe();
  
  // Manually set the board state
  game.board = [...boardArray];
  game.currentPlayer = currentPlayer;
  game.winner = game._checkWinner();
  
  // Reconstruct move history from board
  game.moveHistory = [];
  let player = 'X';
  for (let i = 0; i < boardArray.length; i++) {
    if (boardArray[i] !== null) {
      game.moveHistory.push({ position: i, player: boardArray[i] });
    }
  }
  
  return game;
}

/**
 * Execute a sequence of moves on a game and return results
 * @param {TicTacToe} game - Game instance
 * @param {number[]} moves - Array of positions to play
 * @returns {Object[]} - Array of result objects from makeMove
 */
export function playSequence(game, moves) {
  const results = [];
  for (const position of moves) {
    results.push(game.makeMove(position));
  }
  return results;
}
