import type { Diagnostic, ParsedInterface } from "./types.ts";

const RESERVED_WORDS = new Set([
  "delete", "class", "default", "import", "export", "function", "var", "let", "const",
  "typeof", "instanceof", "in", "new", "this", "super", "catch", "throw", "try",
  "switch", "case", "break", "continue", "return", "if", "else", "while", "do", "for"
]);

export function analyzeInterface(parsed: ParsedInterface): Diagnostic[] {
  const diagnostics: Diagnostic[] = [...parsed.diagnostics];
  const seenNames = new Set<string>();

  for (const fn of parsed.functions) {
    // Check duplicate names
    if (seenNames.has(fn.name)) {
      diagnostics.push({
        level: "warning",
        code: "OVERLOAD_OR_DUPLICATE",
        message: `Duplicate or overloaded function name '${fn.name}'. Overloaded signatures may require unique naming in higher-level RPC/REST mappings.`,
        functionName: fn.name,
        line: fn.line,
        suggestion: `Consider renaming or namespace-qualifying '${fn.name}' to ensure disambiguation.`
      });
    }
    seenNames.add(fn.name);

    // Check reserved keywords
    if (RESERVED_WORDS.has(fn.name)) {
      diagnostics.push({
        level: "warning",
        code: "RESERVED_KEYWORD_NAME",
        message: `Function name '${fn.name}' is a reserved keyword in JavaScript/TypeScript and Python.`,
        functionName: fn.name,
        line: fn.line,
        suggestion: `Wrapper generator will escape '${fn.name}' with a prefix/suffix (e.g. '${fn.name}_fn' or '${fn.name}Op').`
      });
    }

    // Check documentation
    if (!fn.doc || fn.doc.trim().length === 0) {
      diagnostics.push({
        level: "info",
        code: "MISSING_DOCSTRING",
        message: `Function '${fn.name}' does not have docstrings/comments. Auto-generated descriptions will be inferred.`,
        functionName: fn.name,
        line: fn.line,
        suggestion: `Add docstrings to enhance generated OpenAPI summaries and LLM agent tool calling descriptions.`
      });
    }

    // Check pointers / raw memory
    if (fn.returnType.isPointer && fn.returnType.type !== "string") {
      diagnostics.push({
        level: "warning",
        code: "RAW_POINTER_RETURN",
        message: `Function '${fn.name}' returns a raw pointer '${fn.returnType.rawType}'. Higher-level interfaces will wrap this as an opaque handle or copy value.`,
        functionName: fn.name,
        line: fn.line,
        suggestion: `Ensure lifecycle and memory ownership (free/destroy) are handled via safe wrapper objects.`
      });
    }

    // Check parameters
    for (const param of fn.parameters) {
      if (RESERVED_WORDS.has(param.name)) {
        diagnostics.push({
          level: "info",
          code: "RESERVED_KEYWORD_PARAM",
          message: `Parameter '${param.name}' in '${fn.name}' is a reserved keyword in some target languages.`,
          functionName: fn.name,
          line: fn.line,
          suggestion: `Parameter will be escaped automatically in TypeScript/JS wrappers.`
        });
      }

      if (param.isPointer && !param.isConst && param.type !== "string") {
        diagnostics.push({
          level: "info",
          code: "MUTABLE_POINTER_PARAM",
          message: `Parameter '${param.name}' is a non-const pointer '${param.rawType}'. Likely an output or in-out buffer.`,
          functionName: fn.name,
          line: fn.line,
          suggestion: `Higher-level interfaces will convert output parameters into return objects or tuples.`
        });
      }
    }
  }

  return diagnostics;
}
