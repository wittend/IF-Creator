# IF-Creator

> **A visual harness for exploring and generating multi-tier interfaces from low-level C, C++, and Python APIs.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deno](https://img.shields.io/badge/Deno-2.x-black?logo=deno)](https://deno.land/)
[![Docs](https://img.shields.io/badge/Docs-Sphinx%20Furo-blue)](https://pradyunsg.me/furo/)

---

## Overview

**IF-Creator** is an interactive developer tool and visual harness designed to translate low-level function-calling interfaces (C headers, C++ classes, Python 3 typed functions) into progressively higher-level modern abstractions:

1. **Tier 1: Safe Wrapper** – Modern C++20 RAII classes with strict null-pointer checks and exception handling.
2. **Tier 2: OpenAPI & REST Gateway** – Clean REST routing, OpenAPI 3.1.0 specifications, request/response models.
3. **Tier 3: TypeScript / JS SDK** – Strongly-typed asynchronous client with automatic serialization and error wrapping.
4. **Tier 4: Model Context Protocol (MCP)** – AI agent tool schemas, JSON-schema parameter validation, and stdio/SSE server runtime.
5. **Tier 5: Multi-Language & Agent Examples** – Ready-to-run example code for C, C++, TypeScript, and prompt recipes for LLM agents including **Anthropic Claude**, **Earendil-Pi**, and **Nous Hermes**. Each example is presented in its own dedicated, editable window with an individual copy button.

---

## Features

- **Tabbed Single Page App (SPA)**: Visual harness for loading, editing, compiling, and testing interface definitions live in your browser.
- **Diagnostics Window**: Real-time validation pane at the bottom of every tab showing safety warnings, memory ownership cautions, missing docstrings, and syntax errors.
- **Multi-Language Parser**: Ingests C prototypes (`.h`), modern C++ classes (`.hpp`), and Python 3 typed signatures (`.py`).
- **One-Click Export**: Export all generated code tiers directly to disk.
- **Standalone Binary**: Precompiled standalone executable for Debian / Linux environments (`dist/debian/if-creator`).
- **Two ways to run it**: as a native desktop app (Tauri) or as a browser-hosted server you can point at from any machine on your network.

---

## Quick Start

### 1. Run the Visual Harness

Run using Deno:
```bash
deno task start
```
Or run the compiled binary:
```bash
./dist/debian/if-creator
```

Open `http://localhost:3000` in your browser.

By default the server only listens on `127.0.0.1`. To make it reachable from other machines on your network, bind it explicitly:
```bash
deno task start -- --host 0.0.0.0 --port 3000
```
**Warning:** the `/api/fs/*` (filesystem browse) and project save/load endpoints have no authentication, and CORS is wide open. Only bind to `0.0.0.0` on a trusted network.

### 1b. Run as a Native Desktop App (Tauri)

IF-Creator can also run as a native desktop window instead of a browser tab. Under the hood, the desktop app spawns the exact same server binary as a background ("sidecar") process on localhost and opens a native window pointed at it — closing the window stops the sidecar too.

Development mode (requires [Rust](https://rustup.rs/) and the Tauri CLI — see [Desktop App Prerequisites](#desktop-app-prerequisites) below):
```bash
deno task tauri:dev
```

Build an installable desktop package (`.deb` / AppImage on Linux):
```bash
deno task tauri:build
```
Output lands in `src-tauri/target/release/bundle/`.

#### Desktop App Prerequisites

- [Rust & Cargo](https://rustup.rs/)
- Tauri CLI: `cargo install tauri-cli --version "^2" --locked`
- Linux: `libwebkit2gtk-4.1-dev`, `libgtk-3-dev`, `librsvg2-dev`, `patchelf` (via your distro's package manager)
- The sidecar binaries the desktop app launches must be staged first: `deno task compile:sidecar:linux-x64` (or `compile:sidecar:all` for Linux/Windows/macOS). Only the Linux desktop shell can actually be built and run on Linux — Windows/macOS builds need their own native toolchain (MSVC/WebView2, or Xcode/WKWebView) and must be built on those platforms.

### 2. Command-Line Batch Compilation

Compile any C/C++/Python header into all 5 interface tiers directly via CLI:
```bash
./dist/debian/if-creator --input path/to/api.h --output ./generated-api --lang c
```

### 3. Run Unit Tests

Execute the comprehensive automated test suite:
```bash
deno task test
```

### 4. Build Standalone Binary

Compile the standalone binary into `dist/debian/if-creator`:
```bash
deno task compile
```

### 5. Build Documentation

Build Sphinx HTML documentation using the Furo theme:
```bash
deno task docs
```

---

## Project Structure

```
IF-Creator/
├── src/
│   ├── core/
│   │   ├── types.ts          # Core AST and data models
│   │   ├── parser.ts         # C, C++, Python3 interface parser
│   │   ├── diagnostics.ts    # Syntax and safety analyzer
│   │   ├── project.ts        # Project state and tier orchestrator
│   │   └── generators/       # Multi-tier code generators
│   │       ├── c_cpp_wrapper.ts
│   │       ├── openapi_rest.ts
│   │       ├── ts_client.ts
│   │       ├── mcp_server.ts
│   │       └── examples.ts
│   ├── server/
│   │   └── app.ts            # Deno HTTP backend & API routes
│   ├── ui/
│   │   └── app_html.ts       # Bundled SPA frontend
│   └── main.ts               # CLI and application entrypoint
├── tests/                    # Automated test suites
├── dist/debian/              # Debian binary deployment
├── src-tauri/                # Tauri v2 native desktop shell (sidecar wrapper)
│   ├── src/main.rs           # Spawns the server sidecar, opens the native window
│   ├── tauri.conf.json       # Desktop app config (icons, bundle targets, sidecar)
│   ├── capabilities/         # Tauri v2 permission grants (sidecar execute)
│   └── binaries/             # Staged per-platform sidecar binaries (build output)
├── assets/                   # Source assets (e.g. icon-source.png for the desktop app)
├── docs/                     # Sphinx Furo documentation
├── requirements.md           # Project requirements specification
├── CHANGELOG.md              # Version changelog
├── CodeOfConduct.md          # Contributor Covenant Code of Conduct
├── LICENSE                   # MIT License
└── deno.json                 # Deno task configuration
```

---

## Documentation

Full documentation is available in the `docs/` directory and can be built using Sphinx:
```bash
cd docs && make html
```
Generated HTML output will be in `docs/_build/html/index.html`.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
