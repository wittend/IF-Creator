import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { parseCInterface, parseCppInterface, parsePythonInterface } from "../src/core/parser.ts";
import { generateCppSafeWrapper } from "../src/core/generators/c_cpp_wrapper.ts";
import { generateOpenApiSpec } from "../src/core/generators/openapi_rest.ts";
import { generateTsClient } from "../src/core/generators/ts_client.ts";
import { generateMcpServer } from "../src/core/generators/mcp_server.ts";
import {
  generateAllExamples,
  generateEarendilPiExample,
  generateStructuredExamples,
} from "../src/core/generators/examples.ts";

Deno.test("Generators - C++ Safe Wrapper", () => {
  const parsed = parseCInterface("int compute_matrix(const double* mat, int size);");
  parsed.name = "MatrixMath";
  const code = generateCppSafeWrapper(parsed, { namespace: "MathModule" });

  assertStringIncludes(code, "namespace MathModule");
  assertStringIncludes(code, "class MatrixMathWrapper");
  assertStringIncludes(code, "int64_t compute_matrix(");
  assertStringIncludes(code, 'throw ApiException("Parameter \'mat\' cannot be null");');
});

Deno.test("Generators - OpenAPI 3.1 Specification", () => {
  const parsed = parseCInterface("int run_job(const char* name, int priority);");
  parsed.name = "JobService";
  const jsonStr = generateOpenApiSpec(parsed, { apiPrefix: "/api/v2" });
  const doc = JSON.parse(jsonStr);

  assertEquals(doc.openapi, "3.1.0");
  assertEquals(doc.info.title, "JobService Gateway API");
  assertEquals(doc.paths["/api/v2/run_job"] !== undefined, true);
  assertEquals(doc.components.schemas.Run_jobRequest !== undefined, true);
});

Deno.test("Generators - TypeScript Client SDK", () => {
  const parsed = parsePythonInterface("def query_vector(prompt: str, top_k: int = 5) -> list[str]: pass");
  parsed.name = "VectorClient";
  const code = generateTsClient(parsed);

  assertStringIncludes(code, "export class VectorClient");
  assertStringIncludes(code, "export interface Query_vectorParams");
  assertStringIncludes(code, "async query_vector(params: Query_vectorParams): Promise<Query_vectorResult>");
});

Deno.test("Generators - Model Context Protocol (MCP) Server", () => {
  const parsed = parseCInterface("int query_records(const char* filter);");
  parsed.name = "DatabaseAPI";
  const code = generateMcpServer(parsed);

  assertStringIncludes(code, "@modelcontextprotocol/sdk");
  assertStringIncludes(code, 'name: "query_records"');
  assertStringIncludes(code, "createMcpServer");
});

Deno.test("Generators - Multi-Language and Agent Examples (Earendil-Pi)", () => {
  const parsed = parseCInterface("int solve(double val);");
  parsed.name = "Solver";
  const code = generateAllExamples(parsed);

  assertStringIncludes(code, "1. C Example");
  assertStringIncludes(code, "2. C++20 Example");
  assertStringIncludes(code, "3. JavaScript / TypeScript Client SDK Example");
  assertStringIncludes(code, "4. Anthropic Claude");
  assertStringIncludes(code, "5. Earendil-Pi Autonomous Agent Integration");
  assertStringIncludes(code, "6. Nous Hermes");

  const structured = generateStructuredExamples(parsed);
  assertStringIncludes(structured.c, "solve(3.1415)");
  assertStringIncludes(structured.cpp, "client.solve(3.1415)");
  assertStringIncludes(structured.ts, "client.solve({ val: 3.1415 })");
  assertStringIncludes(structured.claude, "CLAUDE_TOOLS");
  assertStringIncludes(structured.pi, "EARENDIL_PI_SERVICE");
  assertStringIncludes(structured.pi, "mesh-earendil");
  assertStringIncludes(structured.nous_hermes, "<|im_start|>system");

  const piSolo = generateEarendilPiExample(parsed);
  assertStringIncludes(piSolo, "EARENDIL_PI_SERVICE");
  assertStringIncludes(piSolo, "earendil-pi-executor");
});
