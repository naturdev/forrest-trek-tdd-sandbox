import assert from "node:assert/strict";
import { test } from "node:test";
import { createGameFromMoves, createGameFromBoard, playSequence } from "../src/testHelpers.js";

test("createGameFromMoves creates game with moves executed", () => {
  const game = createGameFromMoves([0, 1, 2]);
  
  const board = game.getBoard();
  assert.equal(board[0], 'X');
  assert.equal(board[1], 'O');
  assert.equal(board[2], 'X');
  assert.equal(game.currentPlayer, 'O');
  assert.equal(game.getMoveHistory().length, 3);
});

test("createGameFromMoves with empty array creates new game", () => {
  const game = createGameFromMoves([]);
  
  const board = game.getBoard();
  assert.equal(board.every(cell => cell === null), true);
  assert.equal(game.currentPlayer, 'X');
  assert.equal(game.getMoveHistory().length, 0);
});

test("createGameFromBoard sets up specific board state", () => {
  const boardArray = ['X', 'O', 'X', null, null, null, null, null, null];
  const game = createGameFromBoard(boardArray, 'O');
  
  const board = game.getBoard();
  assert.deepEqual(board, boardArray);
  assert.equal(game.currentPlayer, 'O');
});

test("createGameFromBoard detects winner in initial state", () => {
  const boardArray = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
  const game = createGameFromBoard(boardArray);
  
  assert.equal(game.getWinner(), 'X');
  assert.equal(game.isGameOver(), true);
});

test("createGameFromBoard defaults to X as current player", () => {
  const boardArray = [null, null, null, null, null, null, null, null, null];
  const game = createGameFromBoard(boardArray);
  
  assert.equal(game.currentPlayer, 'X');
});

test("playSequence executes moves and returns results", () => {
  const game = createGameFromMoves([]);
  const results = playSequence(game, [0, 1, 2]);
  
  assert.equal(results.length, 3);
  assert.equal(results[0].success, true);
  assert.equal(results[1].success, true);
  assert.equal(results[2].success, true);
  
  const board = game.getBoard();
  assert.equal(board[0], 'X');
  assert.equal(board[1], 'O');
  assert.equal(board[2], 'X');
});

test("playSequence captures errors in results", () => {
  const game = createGameFromMoves([0]);
  const results = playSequence(game, [0, 1]); // Try to play on occupied cell
  
  assert.equal(results.length, 2);
  assert.equal(results[0].success, false);
  assert.equal(results[0].error, "Cell is already occupied");
  assert.equal(results[1].success, true);
});
