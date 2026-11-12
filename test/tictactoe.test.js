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
