# forrest-trek-tdd-sandbox

Throwaway repo for testing Forrest Trek. Tests: `npm test` (node:test, no dependencies).

## Modules

### Tic-Tac-Toe Game
A complete tic-tac-toe implementation with visual UI.

**Play in browser:**
Open `index.html` in a web browser to play Rabbit 🐰 vs Turtle 🐢!

**Use programmatically:**
```javascript
import { TicTacToe } from './src/tictactoe.js';

const game = new TicTacToe();
game.makeMove(0); // X at position 0
game.makeMove(1); // O at position 1
console.log(game.getBoard()); // ['X', 'O', null, ...]
```

**Run tests:**
```bash
npm test
```
