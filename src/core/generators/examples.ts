import type { FunctionDef, ParsedInterface, ProjectOptions } from "../types.ts";

export interface StructuredExamples {
  c: string;
  cpp: string;
  ts: string;
  claude: string;
  pi: string;
  nous_hermes: string;
  combined: string;
}

export function generateStructuredExamples(parsed: ParsedInterface, options?: ProjectOptions): StructuredExamples {
  const c = generateCExample(parsed);
  const cpp = generateCppExample(parsed, options);
  const ts = generateTsExample(parsed, options);
  const claude = generateClaudeExample(parsed);
  const pi = generateEarendilPiExample(parsed);
  const nous_hermes = generateNousHermesExample(parsed);

  const sections: string[] = [];
  sections.push("// ============================================================================");
  sections.push(`// Multi-Language & High-Level Agent Integration Examples`);
  sections.push(`// Target Interface: ${parsed.name}`);
  sections.push("// ============================================================================");
  sections.push("");
  sections.push(c);
  sections.push("\n" + "-".repeat(80) + "\n");
  sections.push(cpp);
  sections.push("\n" + "-".repeat(80) + "\n");
  sections.push(ts);
  sections.push("\n" + "-".repeat(80) + "\n");
  sections.push(claude);
  sections.push("\n" + "-".repeat(80) + "\n");
  sections.push(pi);
  sections.push("\n" + "-".repeat(80) + "\n");
  sections.push(nous_hermes);

  return {
    c,
    cpp,
    ts,
    claude,
    pi,
    nous_hermes,
    combined: sections.join("\n"),
  };
}

export function generateAllExamples(parsed: ParsedInterface, options?: ProjectOptions): string {
  return generateStructuredExamples(parsed, options).combined;
}

export function generateCExample(parsed: ParsedInterface): string {
  const lines: string[] = [];
  lines.push("/* -------------------------------------------------------------------------- */");
  lines.push("/* 1. C Example (Direct Low-Level C ABI Invocation)                           */");
  lines.push("/* -------------------------------------------------------------------------- */");
  lines.push('#include <stdio.h>');
  lines.push('#include <stdlib.h>');
  lines.push('#include "low_level_api.h"');
  lines.push("");
  lines.push("int main(int argc, char** argv) {");
  lines.push(`    printf("Initializing ${parsed.name} C Client...\\n");`);
  lines.push("");

  for (const fn of parsed.functions.slice(0, 3)) {
    const sampleArgs = fn.parameters.map((p) => getSampleLiteralValue(p.type, "c")).join(", ");
    if (fn.returnType.isVoid) {
      lines.push(`    ${fn.name}(${sampleArgs});`);
    } else {
      lines.push(`    ${fn.returnType.rawType} res_${fn.name} = ${fn.name}(${sampleArgs});`);
      lines.push(`    printf("Executed ${fn.name} -> returned status\\n");`);
    }
  }

  lines.push("");
  lines.push('    printf("All C operations completed successfully.\\n");');
  lines.push("    return 0;");
  lines.push("}");
  return lines.join("\n");
}

export function generateCppExample(parsed: ParsedInterface, options?: ProjectOptions): string {
  const ns = options?.namespace || "SafeApi";
  const className = `${parsed.name || "Client"}Wrapper`;
  const lines: string[] = [];
  lines.push("// --------------------------------------------------------------------------");
  lines.push("// 2. C++20 Example (RAII Safe Wrapper with Exception Handling)              ");
  lines.push("// --------------------------------------------------------------------------");
  lines.push("#include <iostream>");
  lines.push('#include "safe_wrapper.hpp"');
  lines.push("");
  lines.push("int main() {");
  lines.push("    try {");
  lines.push(`        ${ns}::${className} client;`);
  lines.push(`        std::cout << "Connected to ${parsed.name} C++ wrapper\\n";`);
  lines.push("");

  for (const fn of parsed.functions.slice(0, 3)) {
    const sampleArgs = fn.parameters.map((p) => getSampleLiteralValue(p.type, "cpp")).join(", ");
    if (fn.returnType.isVoid) {
      lines.push(`        client.${fn.name}(${sampleArgs});`);
    } else {
      lines.push(`        auto res_${fn.name} = client.${fn.name}(${sampleArgs});`);
      lines.push(`        std::cout << "C++ ${fn.name} execution succeeded\\n";`);
    }
  }

  lines.push("");
  lines.push("    } catch (const std::exception& e) {");
  lines.push('        std::cerr << "Error: " << e.what() << "\\n";');
  lines.push("        return 1;");
  lines.push("    }");
  lines.push("    return 0;");
  lines.push("}");
  return lines.join("\n");
}

export function generateTsExample(parsed: ParsedInterface, options?: ProjectOptions): string {
  const className = `${capitalize(parsed.name || "ApiClient")}`;
  const lines: string[] = [];
  lines.push("// --------------------------------------------------------------------------");
  lines.push("// 3. JavaScript / TypeScript Client SDK Example                            ");
  lines.push("// --------------------------------------------------------------------------");
  lines.push(`import { ${className}, ApiException } from "./client.ts";`);
  lines.push("");
  lines.push("async function run() {");
  lines.push(`  const client = new ${className}({ baseUrl: "http://localhost:${options?.restPort || 8000}" });`);
  lines.push("");
  lines.push("  try {");

  for (const fn of parsed.functions.slice(0, 3)) {
    const sampleObj = fn.parameters.map((p) => `${p.name}: ${getSampleLiteralValue(p.type, "ts")}`).join(", ");
    lines.push(`    const res_${fn.name} = await client.${fn.name}({ ${sampleObj} });`);
    lines.push(`    console.log("Result of ${fn.name}:", res_${fn.name});`);
  }

  lines.push("  } catch (err) {");
  lines.push("    if (err instanceof ApiException) {");
  lines.push('      console.error("API error:", err.message, "Status:", err.status);');
  lines.push("    } else {");
  lines.push('      console.error("Unexpected error:", err);');
  lines.push("    }");
  lines.push("  }");
  lines.push("}");
  lines.push("");
  lines.push("run();");
  return lines.join("\n");
}

export function generateClaudeExample(parsed: ParsedInterface): string {
  const lines: string[] = [];
  lines.push("/* ==========================================================================");
  lines.push(" * 4. Anthropic Claude (3.5 Sonnet / 3.7) Tool Calling Integration");
  lines.push(" * ========================================================================== */");
  lines.push("// Tool Definitions for Anthropic Messages API (tools parameter):");
  lines.push("");

  const tools = parsed.functions.map((fn) => ({
    name: fn.name,
    description: fn.doc || `Executes operation ${fn.name} on ${parsed.name}`,
    input_schema: {
      type: "object",
      properties: Object.fromEntries(
        fn.parameters.map((p) => [
          p.name,
          {
            type: p.type === "integer" ? "integer" : p.type === "number" ? "number" : p.type === "boolean" ? "boolean" : "string",
            description: p.doc || `Parameter ${p.name}`,
          },
        ])
      ),
      required: fn.parameters.filter((p) => !p.isOptional).map((p) => p.name),
    },
  }));

  lines.push("const CLAUDE_TOOLS = " + JSON.stringify(tools, null, 2) + ";");
  lines.push("");
  lines.push("// Sample Claude System Prompt:");
  lines.push("/*");
  lines.push(`You are an intelligent assistant equipped with tools for the '${parsed.name}' system.`);
  lines.push("When the user asks to perform operations, invoke the appropriate tool using tool_use blocks.");
  lines.push("*/");
  lines.push("");
  lines.push("// Sample Claude Tool Call invocation format:");
  lines.push("/*");
  if (parsed.functions.length > 0) {
    const f0 = parsed.functions[0];
    const sampleInput = Object.fromEntries(f0.parameters.map((p) => [p.name, getSampleLiteralValue(p.type, "raw")]));
    lines.push(JSON.stringify({
      type: "tool_use",
      id: "toolu_01A09q90tc1qr0ujUrkxGA84",
      name: f0.name,
      input: sampleInput,
    }, null, 2));
  }
  lines.push("*/");
  return lines.join("\n");
}

export function generateEarendilPiExample(parsed: ParsedInterface): string {
  const lines: string[] = [];
  lines.push("/* ==========================================================================");
  lines.push(" * 5. Earendil-Pi Autonomous Agent Integration");
  lines.push(" * ========================================================================== */");
  lines.push("// Earendil-Pi agent service descriptor & autonomous protocol endpoint binding:");
  lines.push("");
  lines.push(`const EARENDIL_PI_SERVICE = {`);
  lines.push(`  protocol: "earendil/v1",`);
  lines.push(`  agent: "earendil-pi-executor",`);
  lines.push(`  service_id: "org.earendil.${(parsed.name || "api").toLowerCase()}",`);
  lines.push(`  endpoint_dock: {`);
  lines.push(`    transport: "mesh-earendil",`);
  lines.push(`    target_interface: "${parsed.name}",`);
  lines.push(`  },`);
  lines.push(`  actions: [`);
  for (const fn of parsed.functions) {
    lines.push(`    {`);
    lines.push(`      name: "${fn.name}",`);
    lines.push(`      description: ${JSON.stringify(fn.doc || `Earendil-Pi task action for ${fn.name}`)},`);
    lines.push(`      signature: {`);
    lines.push(`        params: ${JSON.stringify(fn.parameters.map((p) => ({ name: p.name, type: p.type })))},`);
    lines.push(`        returnType: "${fn.returnType.type}"`);
    lines.push(`      }`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);
  lines.push(`  system_prompt: "You are Earendil-Pi, an autonomous agent operating over distributed and native interface nodes. Invoke verified actions defined in the service manifest to interact with ${parsed.name}."`);
  lines.push(`};`);
  lines.push("");
  lines.push("// Sample Earendil-Pi RPC message dispatch payload:");
  lines.push("/*");
  if (parsed.functions.length > 0) {
    const f0 = parsed.functions[0];
    const sampleParams = Object.fromEntries(f0.parameters.map((p) => [p.name, getSampleLiteralValue(p.type, "raw")]));
    lines.push(JSON.stringify({
      version: "earendil-pi/1.0",
      id: "ep_msg_9841af82",
      action: f0.name,
      params: sampleParams,
      timestamp: Date.now(),
    }, null, 2));
  }
  lines.push("*/");
  return lines.join("\n");
}

export const generatePiExample = generateEarendilPiExample;

export function generateNousHermesExample(parsed: ParsedInterface): string {
  const lines: string[] = [];
  lines.push("/* ==========================================================================");
  lines.push(" * 6. Nous Hermes (Hermes-2 / Hermes-3 Structured Tool Calling Prompt)");
  lines.push(" * ========================================================================== */");
  lines.push("");
  lines.push("/*");
  lines.push("<|im_start|>system");
  lines.push("You are a function calling AI model. You are provided with function signatures within <tools></tools> XML tags. You may call one or more functions to assist with the user query. Don't make assumptions about what values to plug into functions. Here are the available tools:");
  lines.push("<tools>");
  for (const fn of parsed.functions) {
    const toolObj = {
      type: "function",
      function: {
        name: fn.name,
        description: fn.doc || `Function ${fn.name}`,
        parameters: {
          type: "object",
          properties: Object.fromEntries(
            fn.parameters.map((p) => [p.name, { type: p.type === "integer" ? "integer" : "string", description: p.doc || p.name }])
          ),
          required: fn.parameters.filter((p) => !p.isOptional).map((p) => p.name),
        },
      },
    };
    lines.push(JSON.stringify(toolObj));
  }
  lines.push("</tools>");
  lines.push("For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:");
  lines.push("<tool_call>");
  lines.push('{"arguments": {"arg_name": "value"}, "name": "function_name"}');
  lines.push("</tool_call><|im_end|>");
  lines.push("<|im_start|>user");
  if (parsed.functions.length > 0) {
    const f0 = parsed.functions[0];
    lines.push(`Can you run ${f0.name} for me with default settings?`);
    lines.push("<|im_end|>");
    lines.push("<|im_start|>assistant");
    lines.push("<tool_call>");
    const sampleArgs = Object.fromEntries(f0.parameters.map((p) => [p.name, getSampleLiteralValue(p.type, "raw")]));
    lines.push(JSON.stringify({ name: f0.name, arguments: sampleArgs }));
    lines.push("</tool_call><|im_end|>");
  } else {
    lines.push("Hello<|im_end|>");
  }
  lines.push("*/");
  return lines.join("\n");
}

function getSampleLiteralValue(type: string, lang: string): any {
  switch (type) {
    case "integer":
      if (lang === "c" || lang === "cpp" || lang === "ts") return "42";
      return 42;
    case "number":
      if (lang === "c" || lang === "cpp" || lang === "ts") return "3.1415";
      return 3.1415;
    case "string":
      if (lang === "c") return '"example_string"';
      if (lang === "cpp") return '"example_string"';
      if (lang === "ts") return '"example_string"';
      return "example_string";
    case "boolean":
      if (lang === "c") return "1";
      if (lang === "cpp" || lang === "ts") return "true";
      return true;
    case "array":
      if (lang === "c") return "NULL";
      if (lang === "cpp") return '{"item1", "item2"}';
      if (lang === "ts") return '["item1", "item2"]';
      return ["item1", "item2"];
    default:
      if (lang === "c" || lang === "cpp") return "NULL";
      if (lang === "ts") return "{}";
      return {};
  }
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
