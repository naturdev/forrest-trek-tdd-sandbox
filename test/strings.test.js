import assert from "node:assert/strict";
import { test } from "node:test";
import { capitalize, reverseWords } from "../src/strings.js";

test("capitalize upper-cases the first letter", () => {
  assert.equal(capitalize("trail"), "Trail");
  assert.equal(capitalize(""), "");
});

test("reverseWords reverses word order and normalizes whitespace", () => {
  assert.equal(reverseWords("  hello   world  "), "world hello");
  assert.equal(reverseWords("hello world"), "world hello");
  assert.equal(reverseWords("single"), "single");
  assert.equal(reverseWords(""), "");
  assert.equal(reverseWords("   "), "");
});
