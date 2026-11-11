# forrest-trek-tdd-sandbox

Throwaway repo for testing Forrest Trek. Tests: `npm test` (node:test, no dependencies).

## Usage

Import the `capitalize` function from the strings module:

```javascript
import { capitalize } from './src/strings.js';

capitalize('hello');     // 'Hello'
capitalize('world');     // 'World'
capitalize('');          // ''
capitalize('JavaScript'); // 'JavaScript'
```

The `capitalize` function takes a string and returns it with the first character converted to uppercase. If the input is an empty string, it returns the empty string unchanged.
