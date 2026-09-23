import type {
  Diagnostic,
  FunctionDef,
  ParameterDef,
  ParsedInterface,
  ReturnTypeDef,
  SourceLanguage,
  StructDef,
} from "./types.ts";

export function normalizeType(rawType: string, lang: SourceLanguage): string {
  const cleaned = rawType.trim().replace(/\s+/g, " ");

  if (lang === "c" || lang === "cpp") {
    const withoutConst = cleaned.replace(/^const\s+/, "").replace(/\s+const$/, "");
    const baseType = withoutConst.replace(/[\*&]/g, "").trim();

    switch (baseType) {
      case "int":
      case "int32_t":
      case "int16_t":
      case "int8_t":
      case "short":
      case "long":
      case "long long":
      case "uint32_t":
      case "uint16_t":
      case "uint8_t":
      case "unsigned int":
      case "unsigned long":
      case "size_t":
        return "integer";
      case "float":
      case "double":
        return "number";
      case "char*":
      case "const char*":
      case "char *":
      case "const char *":
      case "std::string":
      case "string":
        return "string";
      case "bool":
      case "_Bool":
        return "boolean";
      case "void":
        return "void";
      default:
        if (baseType.startsWith("std::vector<") || baseType.startsWith("vector<")) {
          return "array";
        }
        if (baseType.startsWith("std::map<") || baseType.startsWith("map<")) {
          return "object";
        }
        return baseType || "unknown";
    }
  }

  if (lang === "python3") {
    const t = cleaned.toLowerCase();
    if (t === "int") return "integer";
    if (t === "float") return "number";
    if (t === "str") return "string";
    if (t === "bool") return "boolean";
    if (t === "none" || t === "nonetype") return "void";
    if (t.startsWith("list") || t.startsWith("sequence") || t.startsWith("tuple")) return "array";
    if (t.startsWith("dict") || t.startsWith("mapping")) return "object";
    if (t.startsWith("optional[")) {
      const inner = cleaned.slice(9, -1);
      return normalizeType(inner, lang);
    }
    return cleaned || "any";
  }

  return cleaned || "unknown";
}

export function parseCInterface(source: string): ParsedInterface {
  const diagnostics: Diagnostic[] = [];
  const functions: FunctionDef[] = [];
  const structs: StructDef[] = [];

  // Remove comments while preserving lines
  const lines = source.split("\n");
  let inBlockComment = false;
  let currentDoc = "";

  const structRegex = /typedef\s+struct\s*(\w+)?\s*\{([^}]+)\}\s*(\w+)\s*;/g;
  let structMatch;
  while ((structMatch = structRegex.exec(source)) !== null) {
    const structName = structMatch[3] || structMatch[1] || "AnonymousStruct";
    const body = structMatch[2];
    const fields = body.split(";").map((f) => f.trim()).filter(Boolean).map((fieldStr) => {
      const parts = fieldStr.split(/\s+/);
      const name = parts[parts.length - 1].replace(/[\*&]/g, "");
      const type = parts.slice(0, parts.length - 1).join(" ");
      return { name, type };
    });
    structs.push({ name: structName, fields });
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line.startsWith("/*") || inBlockComment) {
      inBlockComment = true;
      currentDoc += (currentDoc ? "\n" : "") + line.replace(/^\/\*+\s*|\s*\*+\/$/g, "").replace(/^\s*\*\s*/, "");
      if (line.includes("*/")) {
        inBlockComment = false;
      }
      continue;
    }

    if (line.startsWith("//")) {
      currentDoc += (currentDoc ? "\n" : "") + line.replace(/^\/\/\s*/, "");
      continue;
    }

    if (!line || line.startsWith("#") || line.startsWith("typedef struct") || line.startsWith("struct")) {
      if (!line) currentDoc = "";
      continue;
    }

    // Attempt to match C function prototype: [modifiers] ReturnType func_name(param1, param2);
    const fnRegex = /^([\w\*\s]+?)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*;/;
    const match = line.match(fnRegex);
    if (match) {
      const rawRet = match[1].trim();
      const name = match[2].trim();
      const rawParams = match[3].trim();

      const isVoid = rawRet === "void";
      const isPointer = rawRet.includes("*");
      const isConst = rawRet.startsWith("const ") || rawRet.endsWith(" const");

      const returnType: ReturnTypeDef = {
        type: normalizeType(rawRet, "c"),
        rawType: rawRet,
        isPointer,
        isConst,
        isVoid,
      };

      const parameters: ParameterDef[] = [];
      if (rawParams && rawParams !== "void") {
        const paramList = rawParams.split(",");
        for (const p of paramList) {
          const trimmedP = p.trim();
          if (!trimmedP) continue;
          
          const pParts = trimmedP.split(/\s+/);
          const pName = pParts[pParts.length - 1].replace(/^[\*&]+/, "");
          const pType = trimmedP.substring(0, trimmedP.lastIndexOf(pName)).trim() || pParts[0];

          parameters.push({
            name: pName || `param${parameters.length + 1}`,
            type: normalizeType(pType, "c"),
            rawType: pType,
            isPointer: pType.includes("*"),
            isConst: pType.includes("const"),
          });
        }
      }

      functions.push({
        name,
        returnType,
        parameters,
        doc: currentDoc || undefined,
        rawSignature: line,
        line: i + 1,
      });

      currentDoc = "";
    }
  }

  if (functions.length === 0 && structs.length === 0 && source.trim().length > 0) {
    diagnostics.push({
      level: "warning",
      code: "EMPTY_OR_UNPARSED",
      message: "No valid C function prototypes or structs detected. Ensure declarations end with a semicolon ';'.",
    });
  }

  return {
    sourceLanguage: "c",
    name: "C_API",
    functions,
    structs,
    rawSource: source,
    diagnostics,
  };
}

export function parseCppInterface(source: string): ParsedInterface {
  const diagnostics: Diagnostic[] = [];
  const functions: FunctionDef[] = [];
  const structs: StructDef[] = [];

  const lines = source.split("\n");
  let currentNamespace = "";
  let currentClass = "";
  let currentDoc = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("//")) {
      currentDoc += (currentDoc ? "\n" : "") + line.replace(/^\/\/\s*/, "");
      continue;
    }

    if (line.startsWith("namespace ")) {
      const nsMatch = line.match(/namespace\s+([a-zA-Z_]\w*)/);
      if (nsMatch) currentNamespace = nsMatch[1];
      continue;
    }

    if (line.startsWith("class ") || line.startsWith("struct ")) {
      const clsMatch = line.match(/(?:class|struct)\s+([a-zA-Z_]\w*)/);
      if (clsMatch) currentClass = clsMatch[1];
      continue;
    }

    if (line.startsWith("}") || line.startsWith("public:") || line.startsWith("private:") || line.startsWith("protected:")) {
      if (line.startsWith("}")) {
        if (currentClass) currentClass = "";
        else if (currentNamespace) currentNamespace = "";
      }
      continue;
    }

    if (!line || line.startsWith("#")) {
      if (!line) currentDoc = "";
      continue;
    }

    // Match C++ method / function
    const fnRegex = /^(?:virtual\s+|static\s+|explicit\s+|inline\s+)*([\w:<>,\s\*&]+?)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*(?:const)?\s*(?:override)?\s*(?:=\s*0)?\s*;/;
    const match = line.match(fnRegex);
    if (match) {
      const rawRet = match[1].trim();
      const name = match[2].trim();
      const rawParams = match[3].trim();

      const returnType: ReturnTypeDef = {
        type: normalizeType(rawRet, "cpp"),
        rawType: rawRet,
        isPointer: rawRet.includes("*"),
        isReference: rawRet.includes("&"),
        isConst: rawRet.includes("const"),
        isVoid: rawRet === "void",
      };

      const parameters: ParameterDef[] = [];
      if (rawParams && rawParams !== "void") {
        const paramList = rawParams.split(",");
        for (const p of paramList) {
          const trimmedP = p.trim();
          if (!trimmedP) continue;

          let defaultValue: string | undefined;
          let decl = trimmedP;
          if (trimmedP.includes("=")) {
            const eqParts = trimmedP.split("=");
            decl = eqParts[0].trim();
            defaultValue = eqParts[1].trim();
          }

          const pParts = decl.split(/\s+/);
          const pName = pParts[pParts.length - 1].replace(/^[\*&]+/, "");
          const pType = decl.substring(0, decl.lastIndexOf(pName)).trim() || pParts[0];

          parameters.push({
            name: pName || `arg${parameters.length + 1}`,
            type: normalizeType(pType, "cpp"),
            rawType: pType,
            isPointer: pType.includes("*"),
            isReference: pType.includes("&"),
            isConst: pType.includes("const"),
            defaultValue,
            isOptional: defaultValue !== undefined,
          });
        }
      }

      functions.push({
        name,
        returnType,
        parameters,
        doc: currentDoc || undefined,
        className: currentClass || undefined,
        namespace: currentNamespace || undefined,
        rawSignature: line,
        line: i + 1,
      });

      currentDoc = "";
    }
  }

  if (functions.length === 0 && source.trim().length > 0) {
    diagnostics.push({
      level: "warning",
      code: "EMPTY_OR_UNPARSED",
      message: "No C++ functions or class methods were parsed. Ensure function declarations terminate with a semicolon ';'.",
    });
  }

  return {
    sourceLanguage: "cpp",
    name: currentClass || currentNamespace || "Cpp_API",
    functions,
    structs,
    rawSource: source,
    diagnostics,
  };
}

export function parsePythonInterface(source: string): ParsedInterface {
  const diagnostics: Diagnostic[] = [];
  const functions: FunctionDef[] = [];
  const structs: StructDef[] = [];

  const lines = source.split("\n");
  let currentClass = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("class ")) {
      const clsMatch = trimmed.match(/class\s+([a-zA-Z_]\w*)/);
      if (clsMatch) currentClass = clsMatch[1];
      i++;
      continue;
    }

    if (trimmed.startsWith("def ") || trimmed.startsWith("async def ")) {
      const fnLine = trimmed;
      const fnMatch = fnLine.match(/(?:async\s+)?def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)(?:\s*->\s*([^:]+))?\s*:/);
      if (fnMatch) {
        const name = fnMatch[1];
        const rawParams = fnMatch[2].trim();
        const rawRet = (fnMatch[3] || "None").trim();

        // Look for docstring immediately following
        let doc: string | undefined;
        let nextIdx = i + 1;
        if (nextIdx < lines.length && lines[nextIdx].trim().startsWith('"""')) {
          const docLines: string[] = [];
          let docLine = lines[nextIdx].trim().replace(/^"""/, "");
          if (docLine.endsWith('"""') && docLine.length > 3) {
            doc = docLine.slice(0, -3).trim();
            nextIdx++;
          } else {
            docLines.push(docLine);
            nextIdx++;
            while (nextIdx < lines.length) {
              const dl = lines[nextIdx];
              if (dl.includes('"""')) {
                docLines.push(dl.replace(/"""/g, ""));
                nextIdx++;
                break;
              }
              docLines.push(dl);
              nextIdx++;
            }
            doc = docLines.join("\n").trim();
          }
        }

        const isVoid = rawRet === "None" || rawRet === "none";
        const returnType: ReturnTypeDef = {
          type: normalizeType(rawRet, "python3"),
          rawType: rawRet,
          isVoid,
        };

        const parameters: ParameterDef[] = [];
        if (rawParams) {
          const pList = rawParams.split(",");
          for (const p of pList) {
            const pTrimmed = p.trim();
            if (!pTrimmed || pTrimmed === "self" || pTrimmed === "cls") continue;

            let pName = pTrimmed;
            let pType = "Any";
            let pDefault: string | undefined;

            if (pTrimmed.includes("=")) {
              const eqParts = pTrimmed.split("=");
              pDefault = eqParts[1].trim();
              pName = eqParts[0].trim();
            }

            if (pName.includes(":")) {
              const typeParts = pName.split(":");
              pName = typeParts[0].trim();
              pType = typeParts[1].trim();
            }

            parameters.push({
              name: pName,
              type: normalizeType(pType, "python3"),
              rawType: pType,
              defaultValue: pDefault,
              isOptional: pDefault !== undefined,
            });
          }
        }

        functions.push({
          name,
          returnType,
          parameters,
          doc,
          className: currentClass || undefined,
          rawSignature: fnLine,
          line: i + 1,
        });

        i = nextIdx;
        continue;
      }
    }

    i++;
  }

  if (functions.length === 0 && source.trim().length > 0) {
    diagnostics.push({
      level: "warning",
      code: "EMPTY_OR_UNPARSED",
      message: "No Python function definitions ('def ...:') were found.",
    });
  }

  return {
    sourceLanguage: "python3",
    name: currentClass || "Python_API",
    functions,
    structs,
    rawSource: source,
    diagnostics,
  };
}

export function parseInterface(source: string, lang: SourceLanguage): ParsedInterface {
  switch (lang) {
    case "c":
      return parseCInterface(source);
    case "cpp":
      return parseCppInterface(source);
    case "python3":
      return parsePythonInterface(source);
    default:
      throw new Error(`Unsupported source language: ${lang}`);
  }
}
