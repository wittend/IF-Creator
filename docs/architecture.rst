Architecture & Multi-Tier Pipeline
==================================

Overview
--------

IF-Creator ingests low-level function signatures and progressively lifts them into modern distributed and agentic interfaces.

Pipeline Tiers
--------------

1. **Input Layer (Low-Level API)**:
   - Ingests raw C header files (`.h`), C++ classes (`.hpp`), or Python 3 typed functions (`.py`).
   - Normalizes types into an intermediate AST representation.

2. **Tier 1: Idiomatic Safe Wrapper**:
   - Modern C++20 RAII classes with smart pointer wrappers, exception handling, and memory safety invariants.

3. **Tier 2: OpenAPI 3.1 & REST Gateway**:
   - Machine-readable REST API specifications with automatic schema validation and operation mappings.

4. **Tier 3: TypeScript / JS SDK**:
   - Strongly-typed async client class with type definitions and HTTP error unwrapping.

5. **Tier 4: Model Context Protocol (MCP)**:
   - Tool calling specifications conforming to MCP 2024/2025, enabling plug-and-play integration with Claude Desktop, Cursor, and agent runtimes.

6. **Tier 5: Agent Prompts & Multi-Language Examples**:
   - Ready-to-use snippets for C, C++, TypeScript, Anthropic Claude, Earendil-Pi, and Nous Hermes, rendered in dedicated editable code editor windows with individual copy actions.
