# Claude Configuration for forrest-trek-tdd-sandbox

## Project Context

This is a minimal TDD sandbox repository designed to test AI coding assistants. It demonstrates clean test-driven development with zero external dependencies.

## Key Principles

### 1. Test-Driven Development (TDD)
- **Always write tests first** before implementation
- Follow the Red-Green-Refactor cycle
- Run `npm test` frequently to verify behavior

### 2. Simplicity
- Use only Node.js built-in modules (no npm packages)
- Keep modules small and focused
- Prefer clarity over cleverness

### 3. Separation of Concerns
- Game logic in `src/` (Node.js compatible, testable)
- UI code in root (browser-only: HTML, CSS, JS)
- Tests in `test/` using Node.js built-in test runner

## Technical Stack

- **Runtime**: Node.js (ES modules)
- **Testing**: `node:test` and `node:assert/strict` (built-in)
- **Module System**: ES modules (`import`/`export`)
- **UI**: Vanilla HTML/CSS/JavaScript (no frameworks)

## Code Patterns

### Module Exports
```javascript
// Named exports (preferred)
export function capitalize(s) { ... }
export class TicTacToe { ... }
```

### Test Structure
```javascript
import assert from "node:assert/strict";
import { test } from "node:test";
import { ModuleName } from "../src/module.js";

test("descriptive test name in plain English", () => {
  // Arrange
  const instance = new ModuleName();
  
  // Act
  const result = instance.method();
  
  // Assert
  assert.equal(result, expected);
});
```

### Error Handling
```javascript
// Return result objects instead of throwing
makeMove(position) {
  if (invalid) {
    return { success: false, error: "Descriptive message" };
  }
  return { success: true };
}
```

### Immutability for Getters
```javascript
// Return copies to prevent external mutation
getBoard() {
  return [...this.board];
}
```

## File Organization

```
src/
  ├── strings.js       # String utility functions
  └── tictactoe.js     # Tic-tac-toe game logic

test/
  ├── strings.test.js     # Tests for strings module
  └── tictactoe.test.js   # Tests for tictactoe module

index.html              # Browser UI entry point
game.js                 # Browser controller (imports from src/)
styles.css              # UI styling
```

## Development Commands

```bash
# Run all tests
npm test

# Tests run automatically on file changes (if using --watch)
npm test -- --watch
```

## When Adding Features

1. **Start with tests**: Create or update test file in `test/`
2. **Run tests**: Verify they fail for the right reason
3. **Implement**: Add minimal code to make tests pass
4. **Verify**: Run tests again to confirm they pass
5. **Refactor**: Improve code while keeping tests green

## Common Tasks

### Adding a new utility function
1. Add test to `test/strings.test.js` (or create new test file)
2. Run `npm test` to see it fail
3. Add function to `src/strings.js` (or create new module)
4. Run `npm test` to see it pass

### Adding game features
1. Add tests to `test/tictactoe.test.js`
2. Update `src/tictactoe.js` to implement
3. If UI changes needed, update `game.js`, `index.html`, or `styles.css`

### Adding UI features
1. Keep game logic in `src/` (testable)
2. Add UI code to `game.js` (controller)
3. Update `index.html` (structure) and `styles.css` (appearance)

## Constraints

- ✅ Use Node.js built-in modules only
- ✅ Write tests for all game logic
- ✅ Keep modules simple and focused
- ❌ No external npm dependencies
- ❌ No test frameworks beyond `node:test`
- ❌ No build tools or transpilation

## Testing Philosophy

- **Unit tests**: Test individual functions and methods in isolation
- **Descriptive names**: Test names should read like documentation
- **Comprehensive coverage**: Test happy paths, edge cases, and error conditions
- **Fast feedback**: Tests should run quickly (no I/O, no network)

## Example Workflow

```javascript
// 1. Write failing test
test("detects diagonal win", () => {
  const game = new TicTacToe();
  game.makeMove(0); // X
  game.makeMove(1); // O
  game.makeMove(4); // X
  game.makeMove(2); // O
  game.makeMove(8); // X wins
  
  assert.equal(game.getWinner(), 'X');
});

// 2. Run: npm test (fails)

// 3. Implement _checkWinner() method

// 4. Run: npm test (passes)

// 5. Refactor if needed, keeping tests green
```

## Notes for AI Assistants

- This repo is intentionally minimal - don't add complexity
- Follow TDD strictly - it's the main teaching point
- All tests must pass before committing
- Keep the existing patterns consistent
- Document any new patterns in this file
