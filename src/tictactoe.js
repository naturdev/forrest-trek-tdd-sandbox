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

    // Place the mark
    this.board[position] = this.currentPlayer;

    // Record move in history
    this.moveHistory.push({
      position: position,
      player: this.currentPlayer
    });

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

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.moveHistory = [];
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

    // Restore the board
    this.board[lastMove.position] = null;

    // Revert to the player who made that move
    this.currentPlayer = lastMove.player;

    // Recalculate winner and game over state
    this.winner = this._checkWinner();

    return { success: true };
  }

  getAvailableMoves() {
    const available = [];
    for (let i = 0; i < this.board.length; i++) {
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
      { type: 'col', index: 0, positions: [0, 3, 6] },
      { type: 'col', index: 1, positions: [1, 4, 7] },
      { type: 'col', index: 2, positions: [2, 5, 8] },
      { type: 'diagonal', index: 0, positions: [0, 4, 8] },
      { type: 'diagonal', index: 1, positions: [2, 4, 6] }
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern.positions;
      if (this.board[a] !== null && 
          this.board[a] === this.board[b] && 
          this.board[a] === this.board[c]) {
        lines.push(pattern);
      }
    }

    return lines;
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
