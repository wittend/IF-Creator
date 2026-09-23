export type SourceLanguage = "c" | "cpp" | "python3";

export type DiagnosticLevel = "error" | "warning" | "info";

export interface Diagnostic {
  level: DiagnosticLevel;
  code: string;
  message: string;
  line?: number;
  column?: number;
  functionName?: string;
  suggestion?: string;
}

export interface ParameterDef {
  name: string;
  type: string;
  rawType: string;
  isPointer?: boolean;
  isReference?: boolean;
  isConst?: boolean;
  isOptional?: boolean;
  defaultValue?: string;
  doc?: string;
}

export interface ReturnTypeDef {
  type: string;
  rawType: string;
  isPointer?: boolean;
  isReference?: boolean;
  isConst?: boolean;
  isVoid?: boolean;
  doc?: string;
}

export interface FunctionDef {
  name: string;
  returnType: ReturnTypeDef;
  parameters: ParameterDef[];
  doc?: string;
  className?: string;
  namespace?: string;
  rawSignature: string;
  line?: number;
}

export interface StructFieldDef {
  name: string;
  type: string;
  doc?: string;
}

export interface StructDef {
  name: string;
  fields: StructFieldDef[];
  doc?: string;
}

export interface ParsedInterface {
  sourceLanguage: SourceLanguage;
  name: string;
  functions: FunctionDef[];
  structs: StructDef[];
  rawSource: string;
  diagnostics: Diagnostic[];
}

export interface ProjectOptions {
  namespace?: string;
  apiPrefix?: string;
  asyncInterface?: boolean;
  generateDocstrings?: boolean;
  targetMcpServerName?: string;
  restPort?: number;
}

export interface ProjectState {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  lowLevelApiPath?: string;
  sourceLanguage: SourceLanguage;
  sourceCode: string;
  options: ProjectOptions;
  tiers: {
    tier1_wrapper?: { code: string; language: string; diagnostics: Diagnostic[] };
    tier2_openapi?: { code: string; language: string; diagnostics: Diagnostic[] };
    tier3_ts_client?: { code: string; language: string; diagnostics: Diagnostic[] };
    tier4_mcp?: { code: string; language: string; diagnostics: Diagnostic[] };
    tier5_examples?: {
      code: string;
      language: string;
      diagnostics: Diagnostic[];
      items?: {
        c?: string;
        cpp?: string;
        ts?: string;
        claude?: string;
        pi?: string;
        nous_hermes?: string;
      };
    };
  };
  updatedAt: string;
}
