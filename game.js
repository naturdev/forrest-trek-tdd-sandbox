import { TicTacToe } from './src/tictactoe.js';

// Player symbols mapping
const PLAYERS = {
  X: { name: 'Rabbit', icon: '🐰' },
  O: { name: 'Turtle', icon: '🐢' }
};

// Initialize game
const game = new TicTacToe();
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const playerRabbit = document.getElementById('player-rabbit');
const playerTurtle = document.getElementById('player-turtle');

// Render the board
function render() {
  const board = game.getBoard();
  const cells = boardElement.querySelectorAll('.cell');
  
  cells.forEach((cell, index) => {
    const value = board[index];
    if (value) {
      cell.textContent = PLAYERS[value].icon;
      cell.disabled = true;
    } else {
      cell.textContent = '';
      cell.disabled = game.isGameOver();
    }
    cell.classList.remove('winner');
  });
  
  updateStatus();
  updateActivePlayer();
}

// Update status message
function updateStatus() {
  const winner = game.getWinner();
  
  if (winner === 'draw') {
    statusElement.textContent = "It's a draw! 🤝";
    statusElement.style.color = '#ffc107';
  } else if (winner) {
    statusElement.textContent = `${PLAYERS[winner].icon} ${PLAYERS[winner].name} wins! 🎉`;
    statusElement.style.color = '#28a745';
    highlightWinningCells();
  } else {
    const currentPlayer = PLAYERS[game.currentPlayer];
    statusElement.textContent = `${currentPlayer.icon} ${currentPlayer.name}'s turn`;
    statusElement.style.color = '#667eea';
  }
}

// Update active player indicator
function updateActivePlayer() {
  if (game.isGameOver()) {
    playerRabbit.classList.remove('active');
    playerTurtle.classList.remove('active');
  } else {
    if (game.currentPlayer === 'X') {
      playerRabbit.classList.add('active');
      playerTurtle.classList.remove('active');
    } else {
      playerRabbit.classList.remove('active');
      playerTurtle.classList.add('active');
    }
  }
}

// Highlight winning cells
function highlightWinningCells() {
  const board = game.getBoard();
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]              // diagonals
  ];
  
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      board[a] !== null &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      const cells = boardElement.querySelectorAll('.cell');
      cells[a].classList.add('winner');
      cells[b].classList.add('winner');
      cells[c].classList.add('winner');
      break;
    }
  }
}

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const index = parseInt(cell.dataset.index);
  
  const result = game.makeMove(index);
  
  if (result.success) {
    render();
  }
}

// Handle reset
function handleReset() {
  game.reset();
  render();
}

// Add event listeners
boardElement.addEventListener('click', (event) => {
  if (event.target.classList.contains('cell')) {
    handleCellClick(event);
  }
});

resetButton.addEventListener('click', handleReset);

// Initial render
render();
