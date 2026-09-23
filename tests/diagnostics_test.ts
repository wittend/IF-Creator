import { assertEquals } from "jsr:@std/assert";
import { parseCInterface } from "../src/core/parser.ts";
import { analyzeInterface } from "../src/core/diagnostics.ts";

Deno.test("Diagnostics - Detect duplicate functions, raw pointers, missing docs, and reserved words", () => {
  const cSource = `
  void* delete(int count);
  void* delete(int count);
  `;

  const parsed = parseCInterface(cSource);
  const diagnostics = analyzeInterface(parsed);

  const duplicateWarning = diagnostics.find((d) => d.code === "OVERLOAD_OR_DUPLICATE");
  assertEquals(duplicateWarning !== undefined, true);

  const reservedKeyword = diagnostics.find((d) => d.code === "RESERVED_KEYWORD_NAME");
  assertEquals(reservedKeyword !== undefined, true);

  const rawPointer = diagnostics.find((d) => d.code === "RAW_POINTER_RETURN");
  assertEquals(rawPointer !== undefined, true);

  const missingDoc = diagnostics.find((d) => d.code === "MISSING_DOCSTRING");
  assertEquals(missingDoc !== undefined, true);
});
