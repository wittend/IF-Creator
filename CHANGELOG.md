# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Tauri v2 Desktop Application Wrapper**: IF-Creator can now run as a native desktop app in addition to the existing browser-hosted server mode. The desktop shell (`src-tauri/`) spawns the same server binary as a background "sidecar" process, waits for it to become healthy, and opens a native window pointed at it — no server/UI logic is duplicated between the two modes. Sidecar binaries can be staged for Linux, Windows, and macOS via new `deno task compile:sidecar:*` tasks; `deno task tauri:dev` / `deno task tauri:build` run and package the desktop shell.
- **`--host` CLI Flag**: The browser-server mode can now be explicitly bound to a non-loopback address (e.g. `--host 0.0.0.0`) for remote/LAN access, in addition to its default `127.0.0.1`-only binding.

### Fixed
- **Client-Side Script Failing to Parse Entirely**: The single-page app's inline `<script>` (`src/ui/app_html.ts`) is generated from a TypeScript template literal; several embedded `\n`/`\"` escape sequences were single-escaped instead of double-escaped, so the outer template literal collapsed them into raw newlines/quotes before they reached the browser. This broke a regex literal and a string literal, causing a syntax error that prevented *any* client-side JavaScript from running (no tab switching, editors, diagnostics, or save/load). Fixed the escaping so the emitted script parses correctly.

## [1.0.0] - 2026-09-23

### Fixed
- **UI Interaction & Modal Backdrop Responsiveness**: Resolved an issue where the file browser modal overlay created an invisible compositing layer blocking UI pointer events by setting modal default display to `none` (and `flex` when open).
- **Tab Switching & Event Scoping**: Fixed tab navigation handlers to avoid reliance on global `event.target`, preventing `ReferenceError` exceptions across diverse webviews and browsers.
- **Resilient Storage Access**: Added exception handling to `localStorage` operations for restricted or embedded webview environments.

### Added
- **Icon-Only Buttons & Browsable Modal Dialogs**: Integrated icon-only buttons for Save (💾), Load (📂), Export (📦), Generate (⚡), Copy (📋), and Browse (📂) actions, ensuring compact sizing across header and toolbar regions.
- **Browsable Save, Load, and Export Interfaces**: Full file system browsing modal for saving project JSON, loading project JSON, exporting multi-tier generated code, and ingesting API definition files.
- **Persistent Path Memory**: Automatic tracking and retrieval of last-used directory and file paths across all browse operations.
- **Browsable Low-Level API Path**: Interactive directory browser modal, file filter, and native device upload picker for selecting low-level C, C++, and Python API definition files.
- **Visual Harness SPA**: Single-page tabbed interface for exploring multi-tier interface generation.
- **Low-Level Interface Parsers**: Full support for parsing C headers, C++ classes and namespaces, and typed Python 3 definitions.
- **Tier 1 Safe Wrapper Generator**: Generates modern C++20 RAII wrappers and safe exception-handling bindings.
- **Tier 2 REST & OpenAPI Specification**: Generates complete OpenAPI 3.1.0 schemas and REST gateway route definitions.
- **Tier 3 TypeScript Client SDK**: Generates strongly typed, async TypeScript/JavaScript client libraries.
- **Tier 4 MCP (Model Context Protocol) Server**: Generates complete MCP tool server schemas and runtime dispatchers for AI agents.
- **Tier 5 Multi-Language & Earendil-Pi Agent Examples**: Generates executable client examples for C, C++, TypeScript, and AI agent prompts for Anthropic Claude (3.5/3.7), Earendil-Pi autonomous agent mesh protocol, and Nous Hermes (2/3).
- **Individual Editable Example Windows**: Each Tier 5 code example is displayed in its own dedicated, resizable and editable window with an individual icon-only copy button (📋) and combined copy support.
- **Diagnostics & Issue Window**: Real-time diagnostic reporting on every tab highlighting syntax problems, pointer safety risks, missing documentation, and type mismatches.
- **Deno-Compiled Executable**: Standalone compiled binary for Debian/Linux environments located in `dist/debian/if-creator`.
- **Sphinx Documentation**: Complete ReadTheDocs-compatible documentation using the `furo` theme.
- **Unit Test Suite**: 100% automated test coverage for parsers, diagnostics, generators, project state management, and HTTP endpoints.
