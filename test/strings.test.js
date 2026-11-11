import assert from "node:assert/strict";
import { test } from "node:test";
import { capitalize, slugify } from "../src/strings.js";

test("capitalize upper-cases the first letter", () => {
  assert.equal(capitalize("trail"), "Trail");
  assert.equal(capitalize(""), "");
});

test("slugify lower-cases, trims and joins words with hyphens", () => {
  assert.equal(slugify("  Hello   World  "), "hello-world");
  assert.equal(slugify("Hello World"), "hello-world");
  assert.equal(slugify("HELLO WORLD"), "hello-world");
  assert.equal(slugify("hello world"), "hello-world");
  assert.equal(slugify("  single  "), "single");
  assert.equal(slugify(""), "");
});
