import { TicTacToe } from './tictactoe.js';

/**
 * Create a TicTacToe game and execute a sequence of moves
 * @param {number[]} moves - Array of positions to play
 * @returns {TicTacToe} - Configured game instance
 */
export function createGameFromMoves(moves) {
  const game = new TicTacToe();
  for (const move of moves) {
    game.makeMove(move);
  }
  return game;
}

/**
 * Create a TicTacToe game with a specific board state
 * @param {Array} boardArray - Array of 9 cells ('X', 'O', or null)
 * @param {string} currentPlayer - 'X' or 'O'
 * @returns {TicTacToe} - Configured game instance
 */
export function createGameFromBoard(boardArray, currentPlayer = 'X') {
  const game = new TicTacToe();
  game.board = [...boardArray];
  game.currentPlayer = currentPlayer;
  game.winner = game._checkWinner();
  return game;
}

/**
 * Execute a sequence of moves and return the results
 * @param {TicTacToe} game - Game instance
 * @param {number[]} moves - Array of positions to play
 * @returns {Array} - Array of result objects from makeMove()
 */
export function playSequence(game, moves) {
  const results = [];
  for (const move of moves) {
    results.push(game.makeMove(move));
  }
  return results;
}
