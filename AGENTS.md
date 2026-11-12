# Agent Guidelines for forrest-trek-tdd-sandbox

This repository is a minimal TDD sandbox for testing AI coding assistants like Forrest Trek.

## Purpose

A throwaway repository demonstrating test-driven development with:
- Zero external dependencies (Node.js built-ins only)
- Simple, focused modules
- Comprehensive test coverage
- Clear patterns for AI agents to follow

## Project Structure

```
src/           # Source code modules
test/          # Test files (*.test.js)
index.html     # Browser UI entry point
game.js        # Browser controller
styles.css     # UI styling
```

## Development Workflow

### Test-Driven Development (TDD)

**Always follow the TDD cycle:**

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make it pass
3. **Refactor**: Improve code while keeping tests green

### Testing

**Run tests:**
```bash
npm test
```

**Test framework:** Node.js built-in `node:test` (no external dependencies)

**Test patterns:**
- Import from `node:assert/strict` and `node:test`
- Use descriptive test names: `test("describes what it tests", () => {...})`
- Use `assert.equal()`, `assert.deepEqual()`, etc.
- One test file per source file: `test/module.test.js` for `src/module.js`

### Code Style

**Module pattern:**
- ES modules with named exports
- `export function name() {}` or `export class Name {}`
- Import with `import { name } from './module.js'`

**Naming:**
- Functions and variables: camelCase
- Classes: PascalCase
- Private methods: prefix with underscore (`_methodName`)
- Test descriptions: plain English sentences

**Error handling:**
- Return result objects `{ success: boolean, error?: string }` rather than throwing
- Validate inputs and return descriptive error messages
- Keep error messages user-friendly

**State management:**
- Mutable state is acceptable for simplicity
- Provide getter methods that return copies to prevent external mutation
- Reset methods should restore initial state completely

## Adding New Features

### For new modules:

1. **Create test file first** (`test/newmodule.test.js`)
   - Write tests for expected behavior
   - Run `npm test` to see them fail
   
2. **Create source file** (`src/newmodule.js`)
   - Implement minimal code to pass tests
   - Run `npm test` to verify
   
3. **Refactor if needed**
   - Keep tests passing
   - Improve code clarity

### For UI features:

1. **Keep game logic separate** from UI code
   - Core logic in `src/` (testable with Node.js)
   - UI code in root (HTML/CSS/JS for browser)
   
2. **UI controller pattern:**
   - Import game logic from `src/`
   - Handle DOM events
   - Update UI based on game state
   - Keep UI code thin (delegate to game logic)

## What NOT to Do

❌ **Don't add external dependencies** - This repo uses only Node.js built-ins  
❌ **Don't skip tests** - Always write tests first (TDD)  
❌ **Don't throw exceptions** for validation - Return result objects  
❌ **Don't mutate arrays/objects** returned from getters - Return copies  
❌ **Don't mix concerns** - Keep game logic separate from UI  

## Examples

### Good test:
```javascript
test("makeMove rejects occupied cell", () => {
  const game = new TicTacToe();
  game.makeMove(0);
  const result = game.makeMove(0);
  
  assert.equal(result.success, false);
  assert.equal(result.error, "Cell is already occupied");
});
```

### Good implementation:
```javascript
export class TicTacToe {
  makeMove(position) {
    if (this.board[position] !== null) {
      return { success: false, error: "Cell is already occupied" };
    }
    // ... rest of logic
    return { success: true };
  }
  
  getBoard() {
    return [...this.board]; // Return copy, not reference
  }
}
```

## Questions?

This is a sandbox - experiment freely! The goal is to demonstrate clean TDD practices for AI coding assistants.
