import assert from "node:assert/strict";
import { test } from "node:test";
import { TicTacToe } from "../src/tictactoe.js";
import { createGameFromMoves, createGameFromBoard, playSequence } from "../src/testHelpers.js";

// Test helpers tests
test("createGameFromMoves creates game with moves played", () => {
  const game = createGameFromMoves([0, 1, 4]);
  
  assert.equal(game.getBoard()[0], 'X');
  assert.equal(game.getBoard()[1], 'O');
  assert.equal(game.getBoard()[4], 'X');
  assert.equal(game.currentPlayer, 'O');
  assert.equal(game.getMoveHistory().length, 3);
});

test("createGameFromBoard creates game with specific state", () => {
  const board = ['X', 'O', 'X', null, null, null, null, null, null];
  const game = createGameFromBoard(board, 'O');
  
  assert.deepEqual(game.getBoard(), board);
  assert.equal(game.currentPlayer, 'O');
});

test("playSequence executes moves and returns results", () => {
  const game = new TicTacToe();
  const results = playSequence(game, [0, 1, 2]);
  
  assert.equal(results.length, 3);
  assert.equal(results[0].success, true);
  assert.equal(results[1].success, true);
  assert.equal(results[2].success, true);
  assert.equal(game.getBoard()[0], 'X');
  assert.equal(game.getBoard()[1], 'O');
  assert.equal(game.getBoard()[2], 'X');
});

// Original tests

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

// Move history tests
test("tracks move history", () => {
  const game = createGameFromMoves([0, 1, 4]);
  
  const history = game.getMoveHistory();
  assert.equal(history.length, 3);
  assert.equal(history[0].position, 0);
  assert.equal(history[0].player, 'X');
  assert.equal(history[1].position, 1);
  assert.equal(history[1].player, 'O');
  assert.equal(history[2].position, 4);
  assert.equal(history[2].player, 'X');
});

test("undo reverts last move", () => {
  const game = createGameFromMoves([0, 1]);
  
  const result = game.undo();
  
  assert.equal(result.success, true);
  assert.equal(game.getBoard()[1], null);
  assert.equal(game.currentPlayer, 'O');
  assert.equal(game.getMoveHistory().length, 1);
});

test("undo multiple times", () => {
  const game = createGameFromMoves([0, 1, 2]);
  
  game.undo();
  game.undo();
  
  assert.equal(game.getBoard()[1], null);
  assert.equal(game.getBoard()[2], null);
  assert.equal(game.currentPlayer, 'O');
  assert.equal(game.getMoveHistory().length, 1);
});

test("undo on empty history returns error", () => {
  const game = new TicTacToe();
  
  const result = game.undo();
  
  assert.equal(result.success, false);
  assert.equal(result.error, "No moves to undo");
});

test("undo after game over", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(3); // O
  game.makeMove(1); // X
  game.makeMove(4); // O
  game.makeMove(2); // X wins
  
  const result = game.undo();
  
  assert.equal(result.success, true);
  assert.equal(game.isGameOver(), false);
  assert.equal(game.getWinner(), null);
});

test("reset clears move history", () => {
  const game = new TicTacToe();
  
  game.makeMove(0);
  game.makeMove(1);
  game.reset();
  
  assert.equal(game.getMoveHistory().length, 0);
});

// Board analysis tests
test("getAvailableMoves returns empty positions", () => {
  const game = new TicTacToe();
  
  game.makeMove(0);
  game.makeMove(4);
  
  const available = game.getAvailableMoves();
  assert.equal(available.length, 7);
  assert.equal(available.includes(0), false);
  assert.equal(available.includes(4), false);
  assert.equal(available.includes(1), true);
});

test("getAvailableMoves on full board", () => {
  const game = new TicTacToe();
  
  // Create draw scenario to fill board
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(2); // X
  game.makeMove(4); // O
  game.makeMove(3); // X
  game.makeMove(5); // O
  game.makeMove(7); // X
  game.makeMove(6); // O
  game.makeMove(8); // X
  
  assert.equal(game.getAvailableMoves().length, 0);
});

test("isBoardFull detects full board", () => {
  const game = new TicTacToe();
  
  assert.equal(game.isBoardFull(), false);
  
  // Create draw scenario
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

test("getWinningLines returns winning line for row", () => {
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

test("getWinningLines returns winning line for column", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(3); // X
  game.makeMove(2); // O
  game.makeMove(6); // X wins
  
  const lines = game.getWinningLines();
  assert.equal(lines.length, 1);
  assert.equal(lines[0].type, 'column');
  assert.equal(lines[0].index, 0);
  assert.deepEqual(lines[0].positions, [0, 3, 6]);
});

test("getWinningLines returns winning line for diagonal", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(4); // X
  game.makeMove(2); // O
  game.makeMove(8); // X wins
  
  const lines = game.getWinningLines();
  assert.equal(lines.length, 1);
  assert.equal(lines[0].type, 'diagonal');
  assert.deepEqual(lines[0].positions, [0, 4, 8]);
});

test("getWinningLines returns empty array when no winner", () => {
  const game = new TicTacToe();
  
  game.makeMove(0);
  game.makeMove(1);
  
  const lines = game.getWinningLines();
  assert.equal(lines.length, 0);
});

// AI tests
test("AI easy mode returns valid move", () => {
  const game = new TicTacToe();
  
  game.makeMove(0); // X
  const aiMove = game.getAIMove('easy', 'O');
  
  assert.notEqual(aiMove, null);
  assert.equal(aiMove >= 0 && aiMove <= 8, true);
  assert.equal(game.getBoard()[aiMove], null);
});

test("AI medium mode takes winning move", () => {
  const game = new TicTacToe();
  
  // Set up: O can win at position 8 (diagonal 0-4-8)
  // Board will be:
  // X O X
  // _ O _
  // X _ _
  game.makeMove(0); // X
  game.makeMove(4); // O (AI) - center
  game.makeMove(2); // X
  game.makeMove(1); // O (AI)
  game.makeMove(6); // X
  
  // O should play at 8 to win (completing diagonal 0-4-8... wait, X is at 0)
  // Let me recalculate: O is at 1, 4. O can win at 7 (column 1: 1-4-7)
  const aiMove = game.getAIMove('medium', 'O');
  assert.equal(aiMove, 7);
});

test("AI medium mode blocks opponent win", () => {
  const game = new TicTacToe();
  
  // Set up: X can win at position 2, O should block
  game.makeMove(0); // X
  game.makeMove(4); // O
  game.makeMove(1); // X
  
  // O should block at 2
  const aiMove = game.getAIMove('medium', 'O');
  assert.equal(aiMove, 2);
});

test("AI hard mode never loses", () => {
  // Play multiple games where AI goes first
  for (let i = 0; i < 5; i++) {
    const game = new TicTacToe();
    
    while (!game.isGameOver()) {
      if (game.currentPlayer === 'X') {
        // AI plays X
        const move = game.getAIMove('hard', 'X');
        game.makeMove(move);
      } else {
        // Random opponent plays O
        const available = game.getAvailableMoves();
        if (available.length > 0) {
          const randomMove = available[Math.floor(Math.random() * available.length)];
          game.makeMove(randomMove);
        }
      }
    }
    
    const winner = game.getWinner();
    // AI should never lose (either win or draw)
    assert.notEqual(winner, 'O');
  }
});

test("AI returns null on full board", () => {
  const game = new TicTacToe();
  
  // Create draw scenario
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(2); // X
  game.makeMove(4); // O
  game.makeMove(3); // X
  game.makeMove(5); // O
  game.makeMove(7); // X
  game.makeMove(6); // O
  game.makeMove(8); // X
  
  const aiMove = game.getAIMove('easy', 'O');
  assert.equal(aiMove, null);
});
