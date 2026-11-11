import assert from "node:assert/strict";
import { test } from "node:test";
import { capitalize } from "../src/strings.js";

test("capitalize upper-cases the first letter", () => {
  assert.equal(capitalize("trail"), "Trail");
  assert.equal(capitalize(""), "");
});
