import type {
  Diagnostic,
  ParsedInterface,
  ProjectOptions,
  ProjectState,
  SourceLanguage,
} from "./types.ts";
import { parseInterface } from "./parser.ts";
import { analyzeInterface } from "./diagnostics.ts";
import { generateCppSafeWrapper } from "./generators/c_cpp_wrapper.ts";
import { generateOpenApiSpec } from "./generators/openapi_rest.ts";
import { generateTsClient } from "./generators/ts_client.ts";
import { generateMcpServer } from "./generators/mcp_server.ts";
import { generateStructuredExamples } from "./generators/examples.ts";

export function createDefaultProject(): ProjectState {
  const sampleC = `// Low-level C interface definition
#include <stdint.h>

/**
 * Initializes the device engine.
 */
int engine_init(const char* device_name, int mode);

/**
 * Executes computation on input buffer.
 */
int engine_compute(const double* input, int count, double* output);

/**
 * Retrieves engine status.
 */
int engine_get_status(void);

/**
 * Shuts down the engine safely.
 */
void engine_shutdown(void);
`;

  return {
    id: "proj_" + Math.random().toString(36).substring(2, 9),
    name: "EngineCoreAPI",
    description: "Multi-tier interface generator for high-performance C Engine Core",
    author: "Dave",
    version: "1.0.0",
    sourceLanguage: "c",
    sourceCode: sampleC,
    options: {
      namespace: "EngineCore",
      apiPrefix: "/api/v1/engine",
      asyncInterface: true,
      generateDocstrings: true,
      targetMcpServerName: "engine-core-mcp",
      restPort: 8080,
    },
    tiers: {},
    updatedAt: new Date().toISOString(),
  };
}

export function compileProjectTiers(project: ProjectState): {
  project: ProjectState;
  parsed: ParsedInterface;
  diagnostics: Diagnostic[];
} {
  const parsed = parseInterface(project.sourceCode, project.sourceLanguage);
  parsed.name = project.name || parsed.name;
  const diagnostics = analyzeInterface(parsed);

  const tier1_code = generateCppSafeWrapper(parsed, project.options);
  const tier2_code = generateOpenApiSpec(parsed, project.options);
  const tier3_code = generateTsClient(parsed, project.options);
  const tier4_code = generateMcpServer(parsed, project.options);
  const examples = generateStructuredExamples(parsed, project.options);

  project.tiers = {
    tier1_wrapper: {
      code: tier1_code,
      language: "cpp",
      diagnostics: diagnostics.filter((d) => !d.functionName || parsed.functions.some((f) => f.name === d.functionName)),
    },
    tier2_openapi: {
      code: tier2_code,
      language: "json",
      diagnostics: diagnostics.filter((d) => d.level === "error" || d.code.includes("OVERLOAD")),
    },
    tier3_ts_client: {
      code: tier3_code,
      language: "typescript",
      diagnostics: diagnostics.filter((d) => d.code.includes("RESERVED") || d.level === "error"),
    },
    tier4_mcp: {
      code: tier4_code,
      language: "typescript",
      diagnostics: diagnostics.filter((d) => d.code === "MISSING_DOCSTRING" || d.level === "error"),
    },
    tier5_examples: {
      code: examples.combined,
      language: "typescript",
      diagnostics: [],
      items: {
        c: examples.c,
        cpp: examples.cpp,
        ts: examples.ts,
        claude: examples.claude,
        pi: examples.pi,
        nous_hermes: examples.nous_hermes,
      },
    },
  };

  project.updatedAt = new Date().toISOString();

  return { project, parsed, diagnostics };
}
