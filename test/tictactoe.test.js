import assert from "node:assert/strict";
import { test } from "node:test";
import { TicTacToe } from "../src/tictactoe.js";

test("initial state has empty board and X starts", () => {
  const game = new TicTacToe();
  const board = game.getBoard();
  
  assert.equal(board.length, 9);
  assert.equal(board.every(cell => cell === null), true);
  assert.equal(game.currentPlayer, 'X');
  assert.equal(game.getWinner(), null);
  assert.equal(game.isGameOver(), false);
});

test("makeMove places mark and switches player", () => {
  const game = new TicTacToe();
  
  const result1 = game.makeMove(0);
  assert.equal(result1.success, true);
  assert.equal(game.getBoard()[0], 'X');
  assert.equal(game.currentPlayer, 'O');
  
  const result2 = game.makeMove(1);
  assert.equal(result2.success, true);
  assert.equal(game.getBoard()[1], 'O');
  assert.equal(game.currentPlayer, 'X');
});

test("makeMove rejects occupied cell", () => {
  const game = new TicTacToe();
  
  game.makeMove(0);
  const result = game.makeMove(0);
  
  assert.equal(result.success, false);
  assert.equal(result.error, "Cell is already occupied");
});

test("makeMove rejects out of bounds position", () => {
  const game = new TicTacToe();
  
  const result1 = game.makeMove(-1);
  assert.equal(result1.success, false);
  assert.equal(result1.error, "Position must be between 0 and 8");
  
  const result2 = game.makeMove(9);
  assert.equal(result2.success, false);
  assert.equal(result2.error, "Position must be between 0 and 8");
});

test("detects horizontal win (top row)", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(3); // O
  game.makeMove(1); // X
  game.makeMove(4); // O
  game.makeMove(2); // X wins
  
  assert.equal(game.getWinner(), 'X');
  assert.equal(game.isGameOver(), true);
});

test("detects vertical win (left column)", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(3); // X
  game.makeMove(2); // O
  game.makeMove(6); // X wins
  
  assert.equal(game.getWinner(), 'X');
  assert.equal(game.isGameOver(), true);
});

test("detects diagonal win (top-left to bottom-right)", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(4); // X
  game.makeMove(2); // O
  game.makeMove(8); // X wins
  
  assert.equal(game.getWinner(), 'X');
  assert.equal(game.isGameOver(), true);
});

test("detects diagonal win (top-right to bottom-left)", () => {
  const game = new TicTacToe();
  
  game.makeMove(2); // X
  game.makeMove(0); // O
  game.makeMove(4); // X
  game.makeMove(1); // O
  game.makeMove(6); // X wins
  
  assert.equal(game.getWinner(), 'X');
  assert.equal(game.isGameOver(), true);
});

test("detects draw when board is full with no winner", () => {
  const game = new TicTacToe();
  
  // Create a draw scenario:
  // X O X
  // X O O
  // O X X
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(2); // X
  game.makeMove(4); // O
  game.makeMove(3); // X
  game.makeMove(5); // O
  game.makeMove(7); // X
  game.makeMove(6); // O
  game.makeMove(8); // X
  
  assert.equal(game.getWinner(), 'draw');
  assert.equal(game.isGameOver(), true);
});

test("rejects moves after game is over", () => {
  const game = new TicTacToe();
  
  // Create a winning scenario
  game.makeMove(0); // X
  game.makeMove(3); // O
  game.makeMove(1); // X
  game.makeMove(4); // O
  game.makeMove(2); // X wins
  
  const result = game.makeMove(5);
  assert.equal(result.success, false);
  assert.equal(result.error, "Game is already over");
});

test("reset clears board and restarts game", () => {
  const game = new TicTacToe();
  
  game.makeMove(0);
  game.makeMove(1);
  game.makeMove(2);
  
  game.reset();
  
  const board = game.getBoard();
  assert.equal(board.every(cell => cell === null), true);
  assert.equal(game.currentPlayer, 'X');
  assert.equal(game.getWinner(), null);
  assert.equal(game.isGameOver(), false);
});

test("getMoveHistory tracks all moves with position and player", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(4); // O
  game.makeMove(1); // X
  
  const history = game.getMoveHistory();
  assert.equal(history.length, 3);
  assert.equal(history[0].position, 0);
  assert.equal(history[0].player, 'X');
  assert.equal(history[1].position, 4);
  assert.equal(history[1].player, 'O');
  assert.equal(history[2].position, 1);
  assert.equal(history[2].player, 'X');
});

test("undo reverts last move and switches player back", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(4); // O
  
  const result = game.undo();
  
  assert.equal(result.success, true);
  assert.equal(game.getBoard()[4], null);
  assert.equal(game.currentPlayer, 'O');
  assert.equal(game.getMoveHistory().length, 1);
});

test("undo works multiple times in sequence", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(2); // X
  
  game.undo(); // Undo X at position 2
  assert.equal(game.getBoard()[2], null);
  assert.equal(game.currentPlayer, 'X');
  
  game.undo(); // Undo O at position 1
  assert.equal(game.getBoard()[1], null);
  assert.equal(game.currentPlayer, 'O');
  
  game.undo(); // Undo X at position 0
  assert.equal(game.getBoard()[0], null);
  assert.equal(game.currentPlayer, 'X');
  assert.equal(game.getMoveHistory().length, 0);
});

test("undo on empty history returns error", () => {
  const game = new TicTacToe();
  
  const result = game.undo();
  
  assert.equal(result.success, false);
  assert.equal(result.error, "No moves to undo");
});

test("undo after game over allows continuing the game", () => {
  const game = new TicTacToe();
  
  // Create a winning scenario
  game.makeMove(0); // X
  game.makeMove(3); // O
  game.makeMove(1); // X
  game.makeMove(4); // O
  game.makeMove(2); // X wins
  
  assert.equal(game.isGameOver(), true);
  
  // Undo the winning move
  const result = game.undo();
  
  assert.equal(result.success, true);
  assert.equal(game.isGameOver(), false);
  assert.equal(game.getBoard()[2], null);
  assert.equal(game.currentPlayer, 'X');
});

test("reset clears move history", () => {
  const game = new TicTacToe();
  
  game.makeMove(0);
  game.makeMove(1);
  game.makeMove(2);
  
  game.reset();
  
  assert.equal(game.getMoveHistory().length, 0);
});

test("getAvailableMoves returns all empty positions", () => {
  const game = new TicTacToe();
  
  // Empty board
  let available = game.getAvailableMoves();
  assert.equal(available.length, 9);
  assert.deepEqual(available, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  
  // After some moves
  game.makeMove(0); // X
  game.makeMove(4); // O
  game.makeMove(8); // X
  
  available = game.getAvailableMoves();
  assert.equal(available.length, 6);
  assert.deepEqual(available, [1, 2, 3, 5, 6, 7]);
});

test("getAvailableMoves returns empty array on full board", () => {
  const game = new TicTacToe();
  
  // Fill the board (draw scenario)
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(2); // X
  game.makeMove(4); // O
  game.makeMove(3); // X
  game.makeMove(5); // O
  game.makeMove(7); // X
  game.makeMove(6); // O
  game.makeMove(8); // X
  
  const available = game.getAvailableMoves();
  assert.equal(available.length, 0);
  assert.deepEqual(available, []);
});

test("isBoardFull returns false on empty board", () => {
  const game = new TicTacToe();
  assert.equal(game.isBoardFull(), false);
});

test("isBoardFull returns false on partial board", () => {
  const game = new TicTacToe();
  game.makeMove(0);
  game.makeMove(1);
  game.makeMove(2);
  
  assert.equal(game.isBoardFull(), false);
});

test("isBoardFull returns true on full board", () => {
  const game = new TicTacToe();
  
  // Fill the board
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(2); // X
  game.makeMove(4); // O
  game.makeMove(3); // X
  game.makeMove(5); // O
  game.makeMove(7); // X
  game.makeMove(6); // O
  game.makeMove(8); // X
  
  assert.equal(game.isBoardFull(), true);
});

test("getWinningLines returns empty array when no winner", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  
  const lines = game.getWinningLines();
  assert.deepEqual(lines, []);
});

test("getWinningLines returns horizontal line for top row win", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(3); // O
  game.makeMove(1); // X
  game.makeMove(4); // O
  game.makeMove(2); // X wins
  
  const lines = game.getWinningLines();
  assert.equal(lines.length, 1);
  assert.equal(lines[0].type, 'row');
  assert.equal(lines[0].index, 0);
  assert.deepEqual(lines[0].positions, [0, 1, 2]);
});

test("getWinningLines returns vertical line for column win", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(3); // X
  game.makeMove(2); // O
  game.makeMove(6); // X wins
  
  const lines = game.getWinningLines();
  assert.equal(lines.length, 1);
  assert.equal(lines[0].type, 'col');
  assert.equal(lines[0].index, 0);
  assert.deepEqual(lines[0].positions, [0, 3, 6]);
});

test("getWinningLines returns diagonal line for diagonal win", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(4); // X
  game.makeMove(2); // O
  game.makeMove(8); // X wins
  
  const lines = game.getWinningLines();
  assert.equal(lines.length, 1);
  assert.equal(lines[0].type, 'diagonal');
  assert.equal(lines[0].index, 0);
  assert.deepEqual(lines[0].positions, [0, 4, 8]);
});

test("getWinningLines returns empty array for draw", () => {
  const game = new TicTacToe();
  
  // Create a draw
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(2); // X
  game.makeMove(4); // O
  game.makeMove(3); // X
  game.makeMove(5); // O
  game.makeMove(7); // X
  game.makeMove(6); // O
  game.makeMove(8); // X
  
  const lines = game.getWinningLines();
  assert.deepEqual(lines, []);
});
