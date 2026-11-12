export class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.moveHistory = [];
  }

  makeMove(position) {
    // Validate position is in bounds
    if (position < 0 || position > 8) {
      return { success: false, error: "Position must be between 0 and 8" };
    }

    // Check if game is already over
    if (this.isGameOver()) {
      return { success: false, error: "Game is already over" };
    }

    // Check if cell is occupied
    if (this.board[position] !== null) {
      return { success: false, error: "Cell is already occupied" };
    }

    // Record move in history
    this.moveHistory.push({
      position,
      player: this.currentPlayer
    });

    // Place the mark
    this.board[position] = this.currentPlayer;

    // Check for winner or draw
    this.winner = this._checkWinner();

    // Switch player if game is not over
    if (!this.isGameOver()) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    return { success: true };
  }

  getBoard() {
    return [...this.board];
  }

  getWinner() {
    return this.winner;
  }

  isGameOver() {
    return this.winner !== null;
  }

  getMoveHistory() {
    return [...this.moveHistory];
  }

  undo() {
    if (this.moveHistory.length === 0) {
      return { success: false, error: "No moves to undo" };
    }

    // Pop the last move
    const lastMove = this.moveHistory.pop();

    // Clear the board position
    this.board[lastMove.position] = null;

    // Revert to the player who made that move
    this.currentPlayer = lastMove.player;

    // Recalculate winner
    this.winner = this._checkWinner();

    return { success: true };
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.moveHistory = [];
  }

  getAvailableMoves() {
    const available = [];
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        available.push(i);
      }
    }
    return available;
  }

  isBoardFull() {
    return this.board.every(cell => cell !== null);
  }

  getWinningLines() {
    const lines = [];
    const winPatterns = [
      { type: 'row', index: 0, positions: [0, 1, 2] },
      { type: 'row', index: 1, positions: [3, 4, 5] },
      { type: 'row', index: 2, positions: [6, 7, 8] },
      { type: 'column', index: 0, positions: [0, 3, 6] },
      { type: 'column', index: 1, positions: [1, 4, 7] },
      { type: 'column', index: 2, positions: [2, 5, 8] },
      { type: 'diagonal', index: 0, positions: [0, 4, 8] },
      { type: 'diagonal', index: 1, positions: [2, 4, 6] }
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern.positions;
      if (
        this.board[a] !== null &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        lines.push(pattern);
      }
    }

    return lines;
  }

  getAIMove(difficulty = 'medium', aiPlayer = 'O') {
    const available = this.getAvailableMoves();
    
    if (available.length === 0) {
      return null;
    }

    if (difficulty === 'easy') {
      // Random move
      return available[Math.floor(Math.random() * available.length)];
    }

    if (difficulty === 'medium') {
      // Check if AI can win
      for (const move of available) {
        const testBoard = [...this.board];
        testBoard[move] = aiPlayer;
        if (this._evaluateBoard(testBoard, aiPlayer) === 10) {
          return move;
        }
      }

      // Check if need to block opponent
      const opponent = aiPlayer === 'X' ? 'O' : 'X';
      for (const move of available) {
        const testBoard = [...this.board];
        testBoard[move] = opponent;
        if (this._evaluateBoard(testBoard, aiPlayer) === -10) {
          return move;
        }
      }

      // Random move
      return available[Math.floor(Math.random() * available.length)];
    }

    if (difficulty === 'hard') {
      // Minimax with alpha-beta pruning
      let bestScore = -Infinity;
      let bestMove = available[0];

      for (const move of available) {
        const testBoard = [...this.board];
        testBoard[move] = aiPlayer;
        const score = this._minimax(testBoard, 0, false, -Infinity, Infinity, aiPlayer);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return bestMove;
    }

    return available[0];
  }

  _minimax(board, depth, isMaximizing, alpha, beta, aiPlayer) {
    const score = this._evaluateBoard(board, aiPlayer);
    
    // Terminal states
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (board.every(cell => cell !== null)) return 0;

    const opponent = aiPlayer === 'X' ? 'O' : 'X';

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = aiPlayer;
          const currentScore = this._minimax(board, depth + 1, false, alpha, beta, aiPlayer);
          board[i] = null;
          maxScore = Math.max(maxScore, currentScore);
          alpha = Math.max(alpha, currentScore);
          if (beta <= alpha) break;
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = opponent;
          const currentScore = this._minimax(board, depth + 1, true, alpha, beta, aiPlayer);
          board[i] = null;
          minScore = Math.min(minScore, currentScore);
          beta = Math.min(beta, currentScore);
          if (beta <= alpha) break;
        }
      }
      return minScore;
    }
  }

  _evaluateBoard(board, aiPlayer) {
    const opponent = aiPlayer === 'X' ? 'O' : 'X';
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        board[a] !== null &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        if (board[a] === aiPlayer) return 10;
        if (board[a] === opponent) return -10;
      }
    }

    return 0;
  }

  _checkWinner() {
    // All possible winning combinations
    const winPatterns = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal top-left to bottom-right
      [2, 4, 6]  // diagonal top-right to bottom-left
    ];

    // Check each winning pattern
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] !== null &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a]; // Return 'X' or 'O'
      }
    }

    // Check for draw (board is full)
    if (this.board.every(cell => cell !== null)) {
      return 'draw';
    }

    // Game is still in progress
    return null;
  }
}
