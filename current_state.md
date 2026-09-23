# IF-Creator: Current State and Recreation Guide

This document provides a comprehensive summary of the project architecture, codebase structure, dependencies, configuration, and the step-by-step process required to recreate **IF-Creator** to its current working state.

---

## 1. Project Overview

**IF-Creator** (Interface Creator) is a developer utility and multi-tier code generator built using **Deno** (TypeScript). It ingests low-level API definitions (C headers, C++ classes, and Python 3 typed stubs) and compiles them into a cohesive 5-tier interface architecture:

1. **Tier 1 (C/C++ Wrapper & Idiomatic Bindings):** High-level object-oriented bindings, RAII memory management, error translation to exceptions / result codes.
2. **Tier 2 (OpenAPI / REST Specification):** OpenAPI 3.1.0 JSON/YAML specification with mapped REST endpoints, schemas, parameters, and response structures.
3. **Tier 3 (TypeScript / Node.js Client SDK):** Strongly-typed client library with async/await methods, fetch/HTTP wrapper, and request/response type definitions.
4. **Tier 4 (Model Context Protocol / MCP Server):** MCP server definitions exposing API functions as AI tool calls with schema validation (JSON Schema) and execution handlers.
5. **Tier 5 (Multi-Model Integration Examples):** Concrete integration examples and prompt templates for LLMs:
   - C / C++ consumer code
   - TypeScript / Node.js SDK consumer code
   - Claude 3.5 / 3.7 Sonnet tool-calling payload examples
   - Earendil-Pi embedded agent integration templates
   - Nous Hermes 3 function-calling templates

The application features both a **CLI interface** and a **Web GUI** with live interactive multi-tab code editors, real-time code compilation, diagnostics reporting, and an API file browser.

---

## 2. Directory Structure

```text
IF-Creator/
├── .gitignore
├── CHANGELOG.md
├── CodeOfConduct.md
├── LICENSE
├── README.md
├── requirements.md
├── package.json
├── deno.json
├── deno.lock
├── index.js                     # Node/cross-runtime entry launcher
├── current_state.md             # This document
├── dist/
│   └── debian/
│       └── if-creator           # Standalone compiled Deno executable binary
├── docs/                        # Sphinx documentation suite
│   ├── Makefile
│   ├── conf.py
│   ├── index.rst
│   ├── requirements.rst
│   ├── architecture.rst
│   ├── user_guide.rst
│   ├── api_reference.rst
│   └── _build/html/             # Rendered HTML Sphinx documentation
├── src/
│   ├── main.ts                  # CLI argument parser & entry point
│   ├── core/
│   │   ├── types.ts             # AST, Project, Diagnostic, and Tier type interfaces
│   │   ├── parser.ts            # C/C++ regex/AST parser & Python stub parser
│   │   ├── project.ts           # Project model, compilation pipeline & builder
│   │   ├── diagnostics.ts       # Linting, validation rules & diagnostics engine
│   │   └── generators/
│   │       ├── c_cpp_wrapper.ts # Tier 1 C/C++ wrapper generator
│   │       ├── openapi_rest.ts  # Tier 2 OpenAPI 3.1.0 generator
│   │       ├── ts_client.ts     # Tier 3 TypeScript SDK client generator
│   │       ├── mcp_server.ts    # Tier 4 MCP server generator
│   │       └── examples.ts      # Tier 5 Multi-model LLM & code examples generator
│   ├── server/
│   │   └── app.ts               # HTTP API server & static asset handler
│   └── ui/
│       └── app_html.ts          # Single-page Web UI application (HTML, CSS, JS)
└── tests/
    ├── parser_test.ts           # Parser unit tests
    ├── project_test.ts          # Project compiler tests
    ├── generators_test.ts       # Code generation tests for all 5 tiers
    ├── diagnostics_test.ts      # Diagnostic engine tests
    └── server_test.ts           # Web server endpoint and HTML integration tests
```

---

## 3. Environment & Tooling Prerequisites

- **Deno** >= v1.40 (v2.x compatible)
- **Node.js** >= 18 (optional, for `package.json` compatibility and npm tools)
- **Python 3 & Sphinx** (optional, for rebuilding Sphinx documentation in `docs/`)
- **Git** & **GitHub CLI (`gh`)**

---

## 4. Step-by-Step Recreation Process

### Step 4.1: Project Configuration Files

1. **`deno.json`**:
   Configures tasks and compiler options:
   ```json
   {
     "name": "@wwr/if-creator",
     "version": "1.0.0",
     "exports": "./src/main.ts",
     "tasks": {
       "start": "deno run --allow-net --allow-read --allow-write --allow-env src/main.ts serve",
       "cli": "deno run --allow-read --allow-write --allow-env src/main.ts",
       "test": "deno test --allow-read --allow-write --allow-net --allow-env",
       "compile": "deno compile --allow-net --allow-read --allow-write --allow-env --allow-run --output dist/debian/if-creator src/main.ts",
       "check": "deno check src/**/*.ts tests/**/*.ts"
     },
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true
     }
   }
   ```

2. **`package.json` & `index.js`**:
   Provided for standard npm package interoperability, launcher wrappers, and IDE tooling recognition.

3. **`.gitignore`**:
   Excludes `dist/`, `.env`, temporary test artifacts, and build caches while retaining docs and tests.

---

### Step 4.2: Core Type Definitions (`src/core/types.ts`)

Define the data models representing:
- `DataType`: Primitive and composite types (void, int, float, double, string, bool, pointer, array, custom struct).
- `Parameter`: Name, type, required status, default values, documentation.
- `FunctionDef`: Method/function name, return type, parameters, comments, async flag, purity.
- `ClassDef` & `StructDef`: Struct/class representation with fields and methods.
- `ParsedApi`: Normalized AST containing functions, classes, structs, constants, and raw source.
- `ProjectConfig` & `Project`: Project metadata (name, author, version, options, tiers).
- `TierResult`: Generated code, metadata, file outputs, and diagnostics.
- `Diagnostic`: Warning, error, and info diagnostics with line numbers and message.

---

### Step 4.3: API Parser Engine (`src/core/parser.ts`)

Implements parsing for:
- **C Function Declarations & Header Files:** Regex/AST-based tokenizer extracting return types, function signatures, pointer types, qualifiers (`const`, `extern`), and Doxygen-style docstrings (`/** ... */`).
- **C++ Class & Struct Declarations:** Class definitions, member methods, constructors, access modifiers (`public:`, `private:`), and namespaces.
- **Python 3 Function Stubs:** `def func(arg: type = val) -> ret:` signatures, type annotations (`List[float]`, `Optional[str]`, `Dict`), and triple-quoted docstrings.

---

### Step 4.4: Multi-Tier Code Generators (`src/core/generators/`)

1. **`c_cpp_wrapper.ts` (Tier 1):**
   Generates C++ OOP classes wrapping low-level C functions or raw C++ APIs, implementing RAII lifecycle management, error code checking, and clean exceptions (`std::runtime_error`).
2. **`openapi_rest.ts` (Tier 2):**
   Generates valid OpenAPI 3.1.0 specification documents in JSON or YAML format with paths for each function, JSON Schema request body specifications, and response status codes (200, 400, 500).
3. **`ts_client.ts` (Tier 3):**
   Generates an idiomatic TypeScript / ES module SDK class using modern `fetch` API, typed request/response payload interfaces, custom error classes, and config options.
4. **`mcp_server.ts` (Tier 4):**
   Generates a Model Context Protocol (MCP) server implementation exposing tool definitions (`ListToolsRequestSchema`, `CallToolRequestSchema`) compatible with Anthropic Claude and MCP-compliant AI hosts.
5. **`examples.ts` (Tier 5):**
   Generates comprehensive usage samples for:
   - C / C++ consumer applications
   - TypeScript / Node.js consumer applications
   - Claude 3.5 / Claude 3.7 Sonnet JSON tool invocation format
   - Earendil-Pi autonomous agent interface configurations
   - Nous Hermes 3 function call prompts

---

### Step 4.5: Diagnostics Engine (`src/core/diagnostics.ts`)

Lints and validates API definitions:
- Detects missing documentation strings.
- Detects raw unmanaged pointers (`void*`, `char*`) lacking length bounds.
- Warns on non-standard return types.
- Suggests prefixing and naming convention improvements.

---

### Step 4.6: Project Pipeline (`src/core/project.ts`)

Connects the parser, diagnostics, and all 5 tier generators in an atomic pipeline:
- `parseSource(language, code)` -> `generateAllTiers(parsedApi, options)` -> `runDiagnostics(project)`.
- Implements project serialization and export to multi-file directory structures or ZIP bundles.

---

### Step 4.7: Web Server & Single-Page GUI (`src/server/app.ts`, `src/ui/app_html.ts`)

1. **Backend Server (`src/server/app.ts`):**
   - Serves the single-page HTML interface.
   - `/api/health`: Health status endpoint.
   - `/api/project`: Compiles project JSON with updated metadata/source and returns generated tiers.
   - `/api/project/import-api`: Reads a local header/stub file, auto-derives project names and prefixes, and compiles the project.
   - `/api/fs/list`: File browser backend for browsing local project files safely.
   - `/api/export`: Exports generated artifacts to disk or downloadable bundle.

2. **Frontend UI (`src/ui/app_html.ts`):**
   - High-contrast responsive multi-panel layout with project metadata form (Name, Author, Language, Namespace, API Prefix, Target MCP Server, File Path).
   - Dynamic Language Selector (C, C++, Python 3) with pre-populated starter templates.
   - Interactive Monaco/Textarea code editors for source input and generated output for all 5 tiers.
   - Multi-tab sub-views for Tier 5 (C, C++, TypeScript, Claude 3.5/3.7, Earendil-Pi, Nous Hermes 3).
   - "New Project" workflow with state initialization.
   - Real-time compilation with debounced form inputs preserving active input focus.
   - File browser modal dialog for selecting local API files.

---

### Step 4.8: CLI Entry Point (`src/main.ts`)

Supports subcommands:
- `if-creator serve [--port 8080] [--host 127.0.0.1]`: Launches the web GUI server.
- `if-creator generate -i <input_file> -o <output_dir> [-l <c|cpp|python3>]`: Headless generation of all 5 tiers.
- `if-creator check -i <input_file>`: Validates syntax and outputs diagnostics.

---

## 5. Verification & Testing

Run the automated test suite with:
```bash
deno test --allow-read --allow-write --allow-net --allow-env
```
All 15 test suites verify:
- Parser correctness for C, C++, and Python.
- Diagnostics generation.
- Correct code generation across Tier 1 through Tier 5.
- Web server endpoints, HTML generation, and dynamic API file imports.

To compile the standalone Debian/Linux binary:
```bash
deno task compile
```
Output is created in `dist/debian/if-creator`.

---

## 6. Sphinx Documentation

Sphinx documentation sources are stored in `docs/`:
- To build HTML documentation:
  ```bash
  cd docs && make html
  ```
- Output is rendered to `docs/_build/html/index.html`.
