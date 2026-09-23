import { assertEquals } from "jsr:@std/assert";
import { resolveServeOptions } from "../src/main.ts";

Deno.test("main - resolveServeOptions defaults to localhost:3000 with browser open", () => {
  const opts = resolveServeOptions({});
  assertEquals(opts, { port: 3000, host: "127.0.0.1", open: true });
});

Deno.test("main - resolveServeOptions honors an explicit --host for remote/LAN binding", () => {
  const opts = resolveServeOptions({ host: "0.0.0.0" });
  assertEquals(opts.host, "0.0.0.0");
  assertEquals(opts.port, 3000);
});

Deno.test("main - resolveServeOptions parses a custom --port", () => {
  const opts = resolveServeOptions({ port: "8080" });
  assertEquals(opts.port, 8080);
});

Deno.test("main - resolveServeOptions falls back to 3000 for a non-numeric --port", () => {
  const opts = resolveServeOptions({ port: "not-a-number" });
  assertEquals(opts.port, 3000);
});

Deno.test("main - resolveServeOptions honors --no-open", () => {
  const opts = resolveServeOptions({ "no-open": true });
  assertEquals(opts.open, false);
});
