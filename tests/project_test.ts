import { assertEquals, assertGreater } from "jsr:@std/assert";
import { compileProjectTiers, createDefaultProject } from "../src/core/project.ts";

Deno.test("Project - Compile all tiers and verify outputs", () => {
  const project = createDefaultProject();
  const { project: compiled, parsed, diagnostics } = compileProjectTiers(project);

  assertEquals(parsed.functions.length, 4);
  assertEquals(compiled.tiers.tier1_wrapper !== undefined, true);
  assertEquals(compiled.tiers.tier2_openapi !== undefined, true);
  assertEquals(compiled.tiers.tier3_ts_client !== undefined, true);
  assertEquals(compiled.tiers.tier4_mcp !== undefined, true);
  assertEquals(compiled.tiers.tier5_examples !== undefined, true);
  const items = compiled.tiers.tier5_examples!.items!;
  assertEquals(items !== undefined, true);
  assertEquals((items.c?.length ?? 0) > 0, true);
  assertEquals((items.cpp?.length ?? 0) > 0, true);
  assertEquals((items.ts?.length ?? 0) > 0, true);
  assertEquals((items.claude?.length ?? 0) > 0, true);
  assertEquals((items.pi?.length ?? 0) > 0, true);
  assertEquals(items.pi?.includes("Earendil-Pi"), true);
  assertEquals((items.nous_hermes?.length ?? 0) > 0, true);

  assertGreater(compiled.tiers.tier1_wrapper!.code.length, 50);
  assertGreater(compiled.tiers.tier2_openapi!.code.length, 50);
  assertGreater(compiled.tiers.tier3_ts_client!.code.length, 50);
  assertGreater(compiled.tiers.tier4_mcp!.code.length, 50);
  assertGreater(compiled.tiers.tier5_examples!.code.length, 50);
});
